// SPDX-License-Identifier: Apache-2.0 and MIT
import crypto from 'crypto';
import BN from 'bn.js';

export default function seedToECDH(seed) {
    const ecdh = crypto.createECDH('secp256k1');
    const privKey = (new BN(seed.substring(2), 16)).mod(ecdh.curve.n).add(new BN(1));
    ecdh.setPrivateKey(privKey.toString('hex'));
    return ecdh;
}