// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { InputGroup, Button, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; 
import Content from './Content';
import createEmptyTree from '../utils/createEmptyTree';
import cleanupFolder from '../utils/cleanupFolder';

function Body({provider, address, ecdh}) {
    const [rootCid, setRootCid] = React.useState("");

    const onCreate = async () => {
        if (!window.confirm("Are you sure?")) return;
        await cleanupFolder();
        setRootCid(await createEmptyTree(address, ecdh));
    }

    return (<>
        <InputGroup className="mb-3">
            <InputGroup.Text>Root CID</InputGroup.Text>
            <FormControl placeholder="CID" value={rootCid} onChange={e => setRootCid(e.currentTarget.value)} />
            { ecdh && <Button variant="danger" onClick={onCreate}>
                Create New
            </Button> }
        </InputGroup>

        <Content provider={provider} address={address} ecdh={ecdh} rootCid={rootCid} setRootCid={setRootCid}/>
    </>);
}

export default Body;