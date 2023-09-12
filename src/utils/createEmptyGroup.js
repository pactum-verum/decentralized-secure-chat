// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';
import { CID } from 'multiformats/cid';
import emptyFolder from './emptyFolder';

export default async function createEmptyGroup(groupName, myName, ipfs, address, ecdh) {
console.log("Creating...")
    // Create dummy ECDH
    const dummyECDH = crypto.createECDH('secp256k1');
    dummyECDH.generateKeys();
console.log("dummyECDH", dummyECDH)

    const keyEncryprionKey = ecdh.computeSecret(dummyECDH.getPublicKey());
    // Generate Common Secret for symmetric encryption of the content
    const commonSecret = crypto.randomBytes(32);
console.log('cs', commonSecret)
    const cipher = 'aes-256-ctr';
    const crypter = crypto.createCipher(cipher, keyEncryprionKey);
    let encCommonKey = Buffer.concat([crypter.update(commonSecret), crypter.final()]);
console.log("encCK", encCommonKey)

    let users = {};
    users[address] = { 
        alias: myName, 
        key: { peer_pubkey: dummyECDH.getPublicKey().toString('hex'), enc_common_key: encCommonKey.toString('hex') }
    }

    const emptyGroup = {
        name: groupName,
        users: users, 
        content: CID.parse(emptyFolder),
    }
console.log("et", emptyGroup);
    const cid = await window.ipfs.dag.put(emptyGroup);
console.log("cid", cid.toString())

    // Non need to sign - the creator trusts himself
    // const signedTree = {
    //     root: emptyTree,
    //     signature: await signer.signMessage(cid.toString())
    // }
    // const scid = await window.ipfs.dag.put(signedTree);

    // No need to notify anyone, as there is only one user now

    return cid.toString();
}