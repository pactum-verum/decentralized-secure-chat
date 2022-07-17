// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar } from 'react-bootstrap';
import Account from './Account';
import Keys from './Keys';

function NavigationBar({provider, setProvider, address, setAddress, ecdh, setEcdh}) {
    return (
        <Navbar className="bg-light justify-content-between">
            <Navbar.Brand>Content Encryption Sample</Navbar.Brand>
            <Navbar.Text> <Account provider={provider} setProvider={setProvider} address={address} setAddress={setAddress} setEcdh={setEcdh}/> <Keys provider={provider} address={address} ecdh={ecdh} setEcdh={setEcdh}/> </Navbar.Text>
        </Navbar>
    );
}

export default NavigationBar;