import React from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import NewMessage from './NewMessage';
import groupNameToTopic from '../utils/groupNameToTopic';
import getCommonKey from '../utils/getCommonKey';
import addUser from '../utils/addUser';
import { CID } from 'multiformats/cid';
import { type } from 'os';


const Group = ({address, signer, ecdh, groupName, setGroupName, groupCid, setGroupCid}) => {
    const [messages, setMessages] = React.useState([]);
    const [users, setUsers] = React.useState({});

    const updateHandler = async (msg) => {
console.log("Update handler called. Users: ", users);
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
console.log("m.cid: ", m.cid, "groupCid: ", groupCid, typeof m.cid, typeof groupCid, m.cid === groupCid);
            if (m.cid === groupCid) return; // No update
            // Merge the new group with the old one.
            if (groupCid === null) {
                setGroupCid(m.cid); // This will trigger a re-render.
                return;
            }
            const newGroup = await window.ipfs.dag.get(CID.parse(m.cid));
console.log("******** newGroup: ", newGroup);
            // Check signer membership.
            // Merge users.
            const mergedUsers = {...users, ...newGroup.value.users};
            //setUsers(mergedUsers);
            // Merge messages.
            let commonLength = 0;
            // Find the length of the common initial sequence
            while (commonLength < messages.length && commonLength < newGroup.value.messages.length && messages[commonLength] === newGroup.value.messages[commonLength]) 
                commonLength++;
            // Merge based on the described rules
            const mergedMessages = [
                ...messages.slice(0, commonLength),  // Common initial sequence
                ...messages.slice(commonLength),    // Rest of the first array
                ...newGroup.value.messages.slice(commonLength)     // Rest of the second array
            ];
            //setMessages(mergedMessages); // !!! Improve this to avoid duplicates.
console.log("Merged messages", {name: groupName, users: mergedUsers, messages: mergedMessages});
            // Save merged group to IPFS and update the display.
            const cidMerged = await window.ipfs.dag.put({name: groupName, users: mergedUsers, messages: mergedMessages});
            const strCidMerged = cidMerged.toString(); 
            setGroupCid(strCidMerged); // This will trigger a re-render.
        } else if (m.instruction === 'join') {
console.log("users: ", users);
            if (m.groupName !== groupName) return;
            if (users[m.address] !== undefined) return; // Already a member.
            if (! window.confirm(`${m.alias} wants to join the group. Do you approve?`)) return;
            // Recover encryption common key.
console.log("users[address]: ", users[m.address]);
            const commonKey = getCommonKey(users[address].key.peer_pubkey, users[address].key.enc_common_key, ecdh);
            const newUser = addUser(m.alias, m.pubkey, commonKey, ecdh);
            // Add user.
            const newUsers = {...users, [m.address]: newUser};
console.log("newUsers: ", newUsers);
            setUsers(newUsers);
            // Add message.
            //const newMessages = [...messages, {user: 'System', text: `${m.alias} joined the group.`, attachments: []}];
            //setMessages(newMessages);
            // Save group to IPFS.
            const cid = await window.ipfs.dag.put({name: groupName, users: newUsers, messages: messages});
            const cidString = cid.toString();
            setGroupCid(cidString);
        }
    }

    React.useEffect(() => {
        if (!groupName) return;
        const topic = groupNameToTopic(groupName);
console.log("(Re)subscribing groupName: ", groupName, "topic: ", topic);
        (async () => {
            try {
                //await window.ipfs.pubsub.unsubscribe(topic, updateHandler);
                await window.ipfs.pubsub.unsubscribe(topic);
            } catch (error) {
                console.log("Error unsubscribing: ", error);
            }
            try {
                await window.ipfs.pubsub.subscribe(topic, updateHandler);
            } catch (error) {
                console.log("Error subscribing: ", error);
            }    
console.log("Subscribed to topic: ", topic);
        })();
        return () => {
            (async () => {
                try {
                    //await window.ipfs.pubsub.unsubscribe(topic, updateHandler);
                    await window.ipfs.pubsub.unsubscribe(topic);
                } catch (error) {
                    console.log("Error unsubscribing: ", error);
                }
            })();
        }
    }, [address, signer, ecdh, groupName]);

    React.useEffect(() => {
console.log("groupCid changed: ", groupCid);
        if (!groupCid) return;
        (async () => {
            const group = await window.ipfs.dag.get(CID.parse(groupCid));
console.log("******** group: ", group);
            if (! group.value.users) return; // This is an invalid CID. Ignore it.
            if (!group.value.users[address]) {
                window.alert("You are not a member of this group!");
                setGroupCid(null);
                return;
            }
            setGroupName(group.value.name);
            setUsers(group.value.users);
console.log("Loaded users", group.value.users);
            setMessages(group.value.messages);
console.log("Loaded group", group);
            await window.ipfs.pubsub.publish(groupNameToTopic(groupName), JSON.stringify({instruction: 'update', groupName: groupName, cid: groupCid}));     
        })();
    }, [groupCid]);

    React.useEffect(() => { // Save group to IPFS
        (async () => {
            if (Object.keys(users).length === 0) return; // Don't save group with no users (uninitialized group).
console.log("****** Saving group on messages change: ", {name: groupName, users: users, messages: messages});
console.log("Users: ", users, typeof users);
            const cid = await window.ipfs.dag.put({name: groupName, users: users, messages: messages});
            const cidString = cid.toString();
            setGroupCid(cidString);
            await window.ipfs.pubsub.publish(groupNameToTopic(groupName), JSON.stringify({instruction: 'update', groupName: groupName, cid: cidString}));
        })();
    }, [messages]);

    // React.useEffect(() => {
    //     setUsers([
    //         { name: 'User1' },
    //         { name: 'User2' },
    //         { name: 'User3' },
    //     ]);

    //     setMessages([
    //         {
    //             user: 'User1',
    //             text: 'Hello, everyone!',
    //             attachments: [{ name: 'image.jpg' }],
    //         },
    //         {
    //             user: 'User2',
    //             text: 'Hi, User1!',
    //             attachments: [],
    //         },
    //     ]);
    // }, []);

console.log("(render) users: ", users);
    if (users[address] === undefined) return (<></>);
    return (<Grid width='100%'>
        <GridItem rowStart={1} colSpan={1} bg='black'>
            <Sidebar users={users} />
        </GridItem>
        <GridItem rowStart={1} colSpan={19} bg='black'>
            <ChatArea messages={messages} />
            <NewMessage user={users[address].alias} messages={messages} setMessages={setMessages}/>
        </GridItem>
    </Grid>);
};

export default Group;
