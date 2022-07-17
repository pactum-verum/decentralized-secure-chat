// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { InputGroup, FormControl, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Dropzone from 'react-dropzone'
import rootPath from '../utils/rootPath';
import encryptFileToMFS from '../utils/encryptFileToMFS';

function AddFiles({provider, address, ecdh, rootCid, setRootCid, root, commonKey}) {
    const [path, setPath] = React.useState("/");

    const onUpload = async (files) => {
        if (!commonKey) {
            window.alert("Cannot upload files.\nMissing encryption keys.");
            return;
        }
        if ("/" !== path[0] || "/" !== path[path.length-1]) {
            window.alert("Path must start and end with \"/\".");
            return;
        }
        await Promise.all(
            files.map(async file => {
                await encryptFileToMFS(file, rootPath + path, commonKey);
            })
        );
        const r = await window.ipfs.files.stat(rootPath, { hash: true });
        root.content = r.cid;
        const cid = await window.ipfs.dag.put(root);
        setRootCid(cid.toString());
        window.alert("Upload completed.")
    }

    return (<>
        <InputGroup className="mb-3">
            <InputGroup.Text>Path</InputGroup.Text>
            <FormControl placeholder="/" value={path} onChange={e => setPath(e.currentTarget.value)} />
        </InputGroup>

        <Dropzone onDrop={onUpload}>
            {({getRootProps, getInputProps}) => (
            <Card border="dark" bg="light">
                <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
            </Card>
        )}
        </Dropzone>
    </>);
}

export default AddFiles;