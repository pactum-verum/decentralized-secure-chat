// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';

export default function getCommonKey(pubkey, encCommonKey, ecdh) {
    try {
        // Recover ECDH shared secret
        const keyEncryprionKey = ecdh.computeSecret(Buffer.from(pubkey, 'hex')); // convert from hex first

        // Decrypt the common Common Secret for symmetric encryption of the content
        const cipher = 'aes-256-ctr';
        const d = crypto.createDecipher(cipher, keyEncryprionKey);
        const dcs = Buffer.concat([d.update(Buffer.from(encCommonKey, 'hex')), d.final()]);
        return dcs.toString('hex');
    } catch(_) { return null; }   
}