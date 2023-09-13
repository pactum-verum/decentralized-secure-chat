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
    const messagesRef = React.useRef(messages);
    React.useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const [users, setUsers] = React.useState({});
    const usersRef = React.useRef(users);
    React.useEffect(() => {
        usersRef.current = users;
    }, [users]);

    const groupCidRef = React.useRef(groupCid);
    React.useEffect(() => {
        groupCidRef.current = groupCid;
    }, [groupCid]);

    const updateHandler = async (msg) => {
console.log("Update handler called. Users: ", users, "usersRef.current: ", usersRef.current);
        const strMsg = String.fromCharCode(...msg.data);
        console.log("groupName: ", groupName); // No groupName reference needed - it does not change since this closure is created.
        console.log("Message:", strMsg);
        const m = JSON.parse(strMsg);
        if (m.instruction === 'broadcast') {
console.log("Received broadcast message: ", m);
            if (m.groupName !== groupName) return;
            const topic = groupNameToTopic(groupName);
            const msg = JSON.stringify({instruction: 'update', groupName: groupName, cid: groupCidRef.current});
            await window.ipfs.pubsub.publish(topic, msg);
        } else if (m.instruction === 'update') {
console.log("Received update message: ", m);
            if (m.groupName !== groupName) return;
console.log("m.cid: ", m.cid, "groupCidRef.current: ", groupCidRef.current);
            if (m.cid === groupCidRef.current) return; // No update
            // Merge the new group with the old one.
            if (groupCidRef.current === null) {
                setGroupCid(m.cid); // This will trigger a re-render.
                return;
            }
            const newGroup = await window.ipfs.dag.get(CID.parse(m.cid));
console.log("******** newGroup: ", newGroup);
            // Check signer membership.
            // Merge users.
            const mergedUsers = {...usersRef.current, ...newGroup.value.users};
            //setUsers(mergedUsers);
            // Merge messages.
            let commonLength = 0;
            // Find the length of the common initial sequence
            while (commonLength < messagesRef.current.length && commonLength < newGroup.value.messages.length && messagesRef.current[commonLength] === newGroup.value.messages[commonLength]) 
                commonLength++;
            // Merge based on the described rules
            const mergedMessages = [
                ...messagesRef.current.slice(0, commonLength),  // Common initial sequence
                ...messagesRef.current.slice(commonLength),    // Rest of the first array
                ...newGroup.value.messages.slice(commonLength)     // Rest of the second array
            ];
            //setMessages(mergedMessages); // !!! Improve this to avoid duplicates.
console.log("Merged messages", {name: groupName, users: mergedUsers, messages: mergedMessages});
            // Save merged group to IPFS and update the display.
            const cidMerged = await window.ipfs.dag.put({name: groupName, users: mergedUsers, messages: mergedMessages});
            const strCidMerged = cidMerged.toString(); 
            setGroupCid(strCidMerged); // This will trigger a re-render.
        } else if (m.instruction === 'join') {
console.log("usersRef.current: ", usersRef.current);
            if (m.groupName !== groupName) return;
            if (usersRef.current[m.address] !== undefined) return; // Already a member.
            if (! window.confirm(`${m.alias} wants to join the group. Do you approve?`)) return;
            // Recover encryption common key.
console.log("usersRef.current[address]: ", usersRef.current[m.address]);
            const commonKey = getCommonKey(usersRef.current[address].key.peer_pubkey, usersRef.current[address].key.enc_common_key, ecdh);
            const newUser = addUser(m.alias, m.pubkey, commonKey, ecdh);
            // Add user.
            const newUsers = {...usersRef.current, [m.address]: newUser};
console.log("newUsers: ", newUsers);
            setUsers(newUsers);
            // Add message.
            //const newMessages = [...messages, {user: 'System', text: `${m.alias} joined the group.`, attachments: []}];
            //setMessages(newMessages);
            // Save group to IPFS.
            const cid = await window.ipfs.dag.put({name: groupName, users: newUsers, messages: messagesRef.current});
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
