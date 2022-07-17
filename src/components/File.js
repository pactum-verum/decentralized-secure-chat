// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { FormControl, Button, Modal } from 'react-bootstrap';
import { toString } from 'uint8arrays/to-string';
import rootPath from '../utils/rootPath';
import decryptBuffer from '../utils/decryptBuffer';

function File({provider, address, ecdh, path, file, commonKey}) {
    const [showModal, setShowModal] = React.useState(false);
    const [cleartext, setCleartext] = React.useState("");

    React.useEffect(() => {
        if (!commonKey) return;
        (async () => {
            const chunks = [];
            for await (const chunk of window.ipfs.files.read(rootPath + path + file.name)) {
                chunks.push(chunk);
            }        
            setCleartext(toString(decryptBuffer(chunks, commonKey)));
        }) ();
    }, [file, commonKey]);

    const modal = (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>File: {path + file.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { !commonKey && "Cannot decrypt!" }
                { commonKey && <FormControl as="textarea" rows={10} readOnly={true} value={cleartext}/> }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setShowModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

    return (<>
        <br/>
        <Button variant="link" onClick={() => setShowModal(true)}>{path + file.name}</Button>
        {modal}
    </>);
}

export default File;
