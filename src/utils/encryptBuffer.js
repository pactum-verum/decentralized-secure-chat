// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';
import { concat } from 'uint8arrays/concat';

export default function encryptBuffer(buffer, commonKey) {
    const cipher = 'aes-256-ctr';
    const encrypter = crypto.createCipher(cipher, Buffer.from(commonKey, 'hex'));
    return Buffer.concat([encrypter.update(Buffer.from(buffer, 'hex')), encrypter.final()]);
}