// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';
import { CID } from 'multiformats/cid';
import emptyFolder from './emptyFolder';

export default async function createEmptyTree(groupName, myName, ipfs, address, ecdh, signer) {
    // Create dummy ECDH
    const dummyECDH = crypto.createECDH('secp256k1');
    dummyECDH.generateKeys();

    const keyEncryprionKey = ecdh.computeSecret(dummyECDH.getPublicKey());
    // Generate Common Secret for symmetric encryption of the content
    const commonSecret = crypto.randomBytes(32);
    const cipher = 'aes-256-ctr';
    const crypter = crypto.createCipher(cipher, keyEncryprionKey);
    let encCommonKey = Buffer.concat([crypter.update(commonSecret), crypter.final()]);

    const ipnsPkey = crypto.randomBytes(32);
    const ipnsCrypter = crypto.createCipher(cipher, keyEncryprionKey);
    const encryptedIPNSpkey = Buffer.concat([ipnsCrypter.update(ipnsPkey), ipnsCrypter.final()]);

    const group = {
        name: groupName,
        encryptedIPNSpkey: encryptedIPNSpkey.toString('hex')
    };

    let users = {};
    users[address] = { 
        alias: myName, 
        key: { peer_pubkey: dummyECDH.getPublicKey().toString('hex'), enc_common_key: encCommonKey.toString('hex') }
    }

    const emptyTree = {
        group: group,
        users: users, 
        content: CID.parse(emptyFolder),
    }
    const cid = await ipfs.dag.put(emptyTree);

    const signedTree = {
        root: emptyTree,
        signature: signer.signMessage(cid.toString())
    }
    const scid = await ipfs.dag.put(signedTree);


    // No pinning planned, but this is the place to pin the rootCid

    return scid.toString();
}