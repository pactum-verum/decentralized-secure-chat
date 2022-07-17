// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AddFiles from './AddFiles';
import FileSubtree from './FileSubtree';
import emptyFolder from '../utils/emptyFolder';

function FileTree({provider, address, ecdh, rootCid, setRootCid, root, commonKey}) {
    return (<>
        Content root: {root.content.toString()}
        <br/> <br/>
        <AddFiles provider={provider} address={address} ecdh={ecdh} rootCid={rootCid} setRootCid={setRootCid} root={root} commonKey={commonKey}/>
        <br/> <br/>
        { root.content.toString() !== emptyFolder && <FileSubtree provider={provider} address={address} ecdh={ecdh} subroot={root.content} path={"/"} commonKey={commonKey}/> }
    </>);
}

export default FileTree;