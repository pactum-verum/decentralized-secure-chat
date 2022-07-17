// SPDX-License-Identifier: Apache-2.0 and MIT
import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import UserList from './UserList';
import FileTree from './FileTree';
import { CID } from 'multiformats/cid';
import getCommonKey from '../utils/getCommonKey';
import { ethers } from 'ethers';

function Content({provider, address, ecdh, rootCid, setRootCid}) {
    const [activeTab, setActiveTab] = React.useState("tree");
    const [root, setRoot] = React.useState(null);
    const [commonKey, setCommonKey] = React.useState(null);

    React.useEffect(() => {
        (async () => {
            try {
                const { value: r } = await window.ipfs.dag.get(CID.parse(rootCid));
                setRoot(r);
                try {
                    const k = getCommonKey(r.users[address].key.peer_pubkey, r.users[address].key.enc_common_key, ecdh);
                    setCommonKey(k);
                } catch(e) { 
                    setCommonKey(null);
                }
            } catch(e) { 
                setRoot(null); 
            }
        }) ();
    }, [rootCid]);

    React.useEffect(() => {
        (async () => {
            try {
                const k = getCommonKey(root.users[address].key.peer_pubkey, root.users[address].key.enc_common_key, ecdh);
                setCommonKey(k);
            } catch(e) { setCommonKey(null); }
        }) ();
    }, [ecdh]);

    if (!root) return (<></>);
    else return (<>
        Common key hash end: {commonKey && ethers.utils.keccak256(Buffer.from(commonKey, 'hex')).toString().substring(62)}
        <br/><br/>
        <Tabs activeKey={activeTab} transition={false} onSelect={key => setActiveTab(key)}>
            <Tab eventKey="users" title="Users">
                <UserList provider={provider} address={address} ecdh={ecdh} rootCid={rootCid} setRootCid={setRootCid} root={root} commonKey={commonKey}/>
            </Tab>
            <Tab eventKey="tree" title="File tree">
                <FileTree provider={provider} address={address} ecdh={ecdh} rootCid={rootCid} setRootCid={setRootCid} root={root} commonKey={commonKey}/>
            </Tab>
        </Tabs>
    </>);
}

export default Content;