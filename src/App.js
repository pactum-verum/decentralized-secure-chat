// SPDX-License-Identifier: Apache-2.0 and MIT
import './App.css';
import React from 'react';
import { Card } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import Body from './components/Body';
import * as IPFS from 'ipfs-http-client';
//import Web3 from 'web3';
//import { ethers } from 'ethers';

function App() {
  const [provider, setProvider] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [ecdh, setEcdh] = React.useState(null);

  React.useEffect(() => {
    async function getIPFS() {
      if (typeof window.ipfs === "undefined") {
        //window.ipfs = await IPFS.create();
        window.ipfs = await IPFS.create("http://localhost:5001");
        console.log("Using local IPFS node.", window.ipfs);
      } else {
        console.log("Using pre-injected IPFS node.", window.ipfs);
      }
    };
    getIPFS();
  }, []);

  return (<Card><Card.Body>
      <NavigationBar provider={provider} setProvider={setProvider} address={address} setAddress={setAddress} ecdh={ecdh} setEcdh={setEcdh}/>
      <br />
      { typeof window.ipfs !== "undefined" && <Body provider={provider} address={address} ecdh={ecdh} /> }
  </Card.Body></Card>);
}

export default App;