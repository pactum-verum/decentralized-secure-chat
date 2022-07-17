// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { InputGroup, FormControl, Button, Modal, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import User from './User';
import addUser from '../utils/addUser';

function UserList({provider, address, ecdh, rootCid, setRootCid, root, commonKey}) {
    const [myAlias, setMyAlias] = React.useState("");
    const [inputAccessRequest, setInputAccessRequest] = React.useState("");
    const [showModal, setShowModal] = React.useState(false);
    const [accessRequest, setAccessRequest] = React.useState("");
    const [requestAlias, setRequestAlias] = React.useState("");

    const refreshRequest = () => {
        if (!ecdh) return;
        const request = { root: rootCid, address: address, pubkey: ecdh.getPublicKey().toString('hex'), alias: requestAlias};
        setAccessRequest(JSON.stringify(request));
    }

    React.useEffect(() => {
        if (!root) return;
        let a = Object.entries(root.users).find(u => u[0] === address);
        if (a) setMyAlias(a[1].alias);
    }, [root]);

    React.useEffect(() => {
        refreshRequest();
    }, [requestAlias]);

    const onRequestAccess = () => {
        setRequestAlias("");
        refreshRequest();
        setShowModal(true);
    }

    const onCopy = async () => await navigator.clipboard.writeText(accessRequest);

    const modal = (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Access Request</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl placeholder="My alias" onChange={e => setRequestAlias(e.currentTarget.value)} />
                <pre>{accessRequest}</pre>
                <Button onClick={onCopy}>Copy to Clipboard</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

    const updateMyAlias = async () => {
        let r = root;
        r.users[address].alias = myAlias;
        const cid = await window.ipfs.dag.put(r);

        // No pinning planned, but this is the place to pin the rootCid
    
        setRootCid(cid.toString());
    }

    const onAddUser = async () => {
        const request = JSON.parse(inputAccessRequest);
        if (Object.keys(root.users).includes(request.address)) {
            window.alert("Error: User already has access.")
        } else if (rootCid !== request.root) {
            window.alert("Error: Root mismatch (not requesting for this tree).")
        } else {
            const cid = await addUser(request, root, commonKey, ecdh);
            if (cid) setRootCid(cid);
        }
    }

    return (<>
        {modal}
        <br/>
        { root && ecdh && !Object.keys(root.users).includes(address.toLowerCase()) &&
        <Button onClick={onRequestAccess}>Request Access</Button> }
        <br/><br/>
        { root && ecdh && Object.keys(root.users).includes(address.toLowerCase()) &&
        <InputGroup className="mb-3">
            <InputGroup.Text>Request</InputGroup.Text>
            <FormControl placeholder="paste request here" value={inputAccessRequest} onChange={e => setInputAccessRequest(e.currentTarget.value)} />
            <Button onClick={onAddUser}>Add user</Button>
        </InputGroup> }
        <br/><br/>
        { root && ecdh && Object.keys(root.users).includes(address.toLowerCase()) &&
        <InputGroup className="mb-3">
            <InputGroup.Text>My alias</InputGroup.Text>
            <FormControl placeholder="type alias here" value={myAlias} onChange={e => setMyAlias(e.currentTarget.value)} />
            <Button onClick={updateMyAlias}>Update</Button>
        </InputGroup> }
        <br/>
        Users:
        <Table striped bordered hover>
            <tbody>
            {Object.entries(root.users).map(userEntry => <User key={userEntry[0]} userAddress={userEntry[0]} user={userEntry[1]} address={address}/>)}
            </tbody>
        </Table>
        
    </>);
}

export default UserList;