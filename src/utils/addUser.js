// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';

export default async function addUser(alias, pubkey, commonSecret, ecdh) {
    try {
        // Derive Shared Key-encryption Secret from request Public Key and my ECDH Private Key
        const keyEncryprionKey = ecdh.computeSecret(Buffer.from(pubkey, 'hex'));

        const cipher = 'aes-256-ctr';
        const crypter = crypto.createCipher(cipher, keyEncryprionKey);
        let encCommonKey = Buffer.concat([crypter.update(Buffer.from(commonSecret, 'hex')), crypter.final()]);

        return { 
            alias: alias, 
            key: { peer_pubkey: ecdh.getPublicKey().toString('hex'), enc_common_key: encCommonKey.toString('hex') }
        }
    } catch (_) { return null; }
}
