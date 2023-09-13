// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';

export default async function addUser(request, root, commonSecret, ecdh) {
    try {
        // Derive Shared Key-encryption Secret from request Public Key and my ECDH Private Key
        const keyEncryprionKey = ecdh.computeSecret(Buffer.from(request.pubkey, 'hex'));

        const cipher = 'aes-256-ctr';
        const crypter = crypto.createCipher(cipher, keyEncryprionKey);
        let encCommonKey = Buffer.concat([crypter.update(Buffer.from(commonSecret, 'hex')), crypter.final()]);

        let r = root;
        r.users[request.address] = { 
            alias: request.alias, 
            key: { peer_pubkey: ecdh.getPublicKey().toString('hex'), enc_common_key: encCommonKey.toString('hex') }
        }

console.log("***** new user: ", r)
        const cid = await window.ipfs.dag.put(r);

        // No pinning planned, but this is the place to pin the rootCid

        return cid.toString();
    } catch (_) { return null; }
}
