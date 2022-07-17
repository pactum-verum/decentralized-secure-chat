// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';
import { CID } from 'multiformats/cid';
import emptyFolder from './emptyFolder';

export default async function createEmptyTree(address, ecdh) {
    // Create dummy ECDH
    const dummyECDH = crypto.createECDH('secp256k1');
    dummyECDH.generateKeys();

    const keyEncryprionKey = ecdh.computeSecret(dummyECDH.getPublicKey());
    // Generate Common Secret for symmetric encryption of the content
    const commonSecret = crypto.randomBytes(32);
    const cipher = 'aes-256-ctr';
    const crypter = crypto.createCipher(cipher, keyEncryprionKey);
    let encCommonKey = Buffer.concat([crypter.update(commonSecret), crypter.final()]);

    let users = {};
    users[address] = { 
        alias: "", 
        key: { peer_pubkey: dummyECDH.getPublicKey().toString('hex'), enc_common_key: encCommonKey.toString('hex') }
    }

    const emptyTree = { 
        users: users, 
        content: CID.parse(emptyFolder)
    }

    const cid = await window.ipfs.dag.put(emptyTree);

    // No pinning planned, but this is the place to pin the rootCid

    return cid.toString();
}