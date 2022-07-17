// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { Button } from 'react-bootstrap';
import { ethers } from "ethers";
import seedToEcdh from '../utils/seedToECDH';
import { createECDH } from 'crypto';

function Keys({provider, address, ecdh, setEcdh}) {
    React.useEffect(() => {
    }, [provider, address]);

    // React.useEffect(() => {
    //     if (!ecdh) return;

    //     // Test the validity of the generated key for Elliptic Curve Diffie-Hellman Key Exchange
    //     const otherECDH = createECDH('secp256k1');
    //     otherECDH.generateKeys();
    
    //     const sec1 = ecdh.computeSecret(otherECDH.getPublicKey());
    //     const sec2 = otherECDH.computeSecret(ecdh.getPublicKey());
    //     const equals = sec1.equals(sec2);
    //     console.log("Elliptic Curve Diffie-Hellman Key Exchange passed: ", equals);
    //     window.alert("Elliptic Curve Diffie-Hellman Key Exchange passed: " + equals);
    // }, [ecdh]);

    const onRegenerate = async () => {
        const signer = provider.getSigner();
        const signature = await signer.signMessage("Sign this to re-generate encryption keys!");

        // Test wallet  RFC 6979 compliance!
        const signatureAgain = await signer.signMessage("Sign this to re-generate encryption keys!");
        if (signature !== signatureAgain) {
            window.alert("Your wallet is not RFC 6979 compliant.\nIt cannot be used with this application!");
            console.log("Non-compliant wallet.");
            return;
        }

        const seed = ethers.utils.keccak256(signature);

        setEcdh(seedToEcdh(seed));
    }

    if (!address || ecdh) return (<></>);
    else return(<Button onClick={onRegenerate}>Regenerate Keys</Button>);
}

export default Keys;