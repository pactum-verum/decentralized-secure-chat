// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { Button } from 'react-bootstrap';
import { ethers } from "ethers";
import Web3Modal from "web3modal";

function Account({provider, setProvider, address, setAddress, setEcdh}) {
    React.useEffect(() => {
        if (!window.ethereum) return;
        window.ethereum.on("connect", info => console.log(info) );
        window.ethereum.on('accountsChanged', accounts => { setAddress(accounts[0].toLowerCase()); setEcdh(null); });
        window.ethereum.on('chainChanged', chainId => window.location.reload() );
        window.ethereum.on('disconnect', error => window.location.reload() );
    }, []);

    const onConnect = async () => {
        const providerOptions = {
            /* See Provider Options Section */
        };

        const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: true, // optional
            providerOptions // required
        });
        const instance = await web3Modal.connect();
        
        const p = new ethers.providers.Web3Provider(instance);
        setProvider(p);
        const signer = p.getSigner();
        setAddress((await signer.getAddress()).toLowerCase());
    }

    if (address) return (<>Account: {address}</>);
    else return(<><Button onClick={onConnect}>Connect</Button> {address}</>);
}

export default Account;