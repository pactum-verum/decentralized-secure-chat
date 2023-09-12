import React from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import groupNameToTopic from '../utils/groupNameToTopic';

const Group = (address, signer, ecdh, groupName, setGroupName, groupCid, setGroupCid) => {
    const updateHandler = async (msg) => {
        const strMsg = String.fromCharCode(...msg.data);
        console.log("groupName: ", groupName);
        console.log("Message:", strMsg);
        const m = JSON.parse(strMsg);
        if (m.instruction === 'broadcast') {
console.log("Received broadcast message: ", m);
        } else if (m.instruction === 'update') {
console.log("Received update message: ", m);
        } else if (m.instruction === 'addUser') {
console.log("Received addUser message: ", m);
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

    const users = [
        { name: 'User1' },
        { name: 'User2' },
        { name: 'User3' },
    ];

    const messages = [
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
    ];

    console.log("ecdh", ecdh);
    console.log("groupCid", groupCid);
    return (<Grid width='100%'>
        <GridItem rowStart={1} colSpan={1} bg='black'>
            <Sidebar users={users} />
        </GridItem>
        <GridItem rowStart={1} colSpan={19} bg='black'>
            <ChatArea messages={messages} />
        </GridItem>
    </Grid>);
};

export default Group;
