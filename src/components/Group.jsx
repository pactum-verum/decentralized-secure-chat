import React from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import NewMessage from './NewMessage';
import groupNameToTopic from '../utils/groupNameToTopic';

const Group = (address, signer, ecdh, groupName, setGroupName, groupCid, setGroupCid) => {
    const [messages, setMessages] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    const updateHandler = async (msg) => {
        const strMsg = String.fromCharCode(...msg.data);
        console.log("groupName: ", groupName);
        console.log("Message:", strMsg);
        const m = JSON.parse(strMsg);
        if (m.instruction === 'broadcast') {
console.log("Received broadcast message: ", m);
            if (m.groupName !== groupName) return;
            const topic = groupNameToTopic(groupName);
            const msg = JSON.stringify({instruction: 'update', groupName: groupName, cid: groupCid});
            await window.ipfs.pubsub.publish(topic, msg);
        } else if (m.instruction === 'update') {
console.log("Received update message: ", m);
            if (m.groupName !== groupName) return;
            if (m.cid === groupCid) return; // No update
            // Merge the new group with the old one.
            // Check signer membership.
            // Merge users.
            // Merge messages.
        }
    }

    React.useEffect(() => {
        if (!groupName) return;
        const topic = groupNameToTopic(groupName);
console.log("(Re)subscribing groupName: ", groupName);
        (async () => {
            await window.ipfs.pubsub.subscribe(topic, updateHandler);
        })();
        return () => {
            (async () => {
                await window.ipfs.pubsub.unsubscribe(topic, updateHandler);
            })();
        }
    }, [address, signer, ecdh, groupName]);

    React.useEffect(() => {
        setUsers([
            { name: 'User1' },
            { name: 'User2' },
            { name: 'User3' },
        ]);

        setMessages([
            {
                user: 'User1',
                text: 'Hello, everyone!',
                attachments: [{ name: 'image.jpg' }],
            },
            {
                user: 'User2',
                text: 'Hi, User1!',
                attachments: [],
            },
        ]);
    }, []);

    console.log("ecdh", ecdh);
    console.log("groupCid", groupCid);
    return (<Grid width='100%'>
        <GridItem rowStart={1} colSpan={1} bg='black'>
            <Sidebar users={users} />
        </GridItem>
        <GridItem rowStart={1} colSpan={19} bg='black'>
            <ChatArea messages={messages} />
            <NewMessage messages={messages} setMessages={setMessages}/>
        </GridItem>
    </Grid>);
};

export default Group;
