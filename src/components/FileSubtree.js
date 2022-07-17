// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AddFiles from './AddFiles';
import File from './File';

function FileSubtree({provider, address, ecdh, subroot, path, commonKey}) {
    const [files, setFiles] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            let l = [];
            for await (const file of window.ipfs.ls(subroot)) {
                l.push(file);
            }
            setFiles(l);
        }) ();
    }, [subroot]);

    return (<>
        {files.map(file => (file.type === "dir" ? 
            <FileSubtree key={file.path} provider={provider} address={address} ecdh={ecdh} subroot={file.path} path={path + file.name + "/"} commonKey={commonKey}/>
            :
            <File key={file.path} provider={provider} address={address} ecdh={ecdh} path={path} file={file} commonKey={commonKey}/>
        ))}
    </>);
}

export default FileSubtree;
