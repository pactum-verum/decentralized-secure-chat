// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';
import { concat } from 'uint8arrays/concat';

export default function decryptBuffer(buffer, commonKey) {
    const cipher = 'aes-256-ctr';
    const decrypter = crypto.createDecipher(cipher, Buffer.from(commonKey, 'hex'));
    return Buffer.concat([decrypter.update(Buffer.from(concat(buffer), 'hex')), decrypter.final()]);
}
