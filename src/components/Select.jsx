import React from 'react';
import { Box, Text, FormLabel, Input, Button, useClipboard } from '@chakra-ui/react'
import createEmptyGroup from '../utils/createEmptyGroup';
import groupNameToTopic from '../utils/groupNameToTopic';

const Select = ({ address, signer, ecdh, setGroupName, setGroupCid }) => {
  const [groupNameEntry, setGroupNameEntry] = React.useState('');
  const [myName, setMyName] = React.useState('');
  
  const createGroup = async () => {
    if (!groupNameEntry) {
      window.alert("Please enter a group name!");
      return;
    }
    if (!myName) {
      window.alert("Please enter your name!");
      return;
    }
console.log("Creating group: ", groupNameEntry, myName);
    setGroupName(groupNameEntry);
    setGroupCid(await createEmptyGroup(groupNameEntry, myName, address, ecdh));
  }

  const joinGroup = async (name) => {
    if (!ecdh) {
      window.alert("Please connect your wallet and sign key generation!");
      return;
    }
    const msg = JSON.stringify({instruction: 'join', groupName: groupNameEntry, alias: name, address: address, pubkey: ecdh.getPublicKey().toString('hex')})
    await window.ipfs.pubsub.publish(groupNameToTopic(groupNameEntry), msg);
      // setGroupName(groupNameEntry);
      // setGroupCid(await createEmptyGroup(groupNameEntry, myName, address, ecdh)); // Will be rejected if group already exists and not already a member.
      await openGroup();
  }

  const updateHandler = async (msg) => {
    const strMsg = String.fromCharCode(...msg.data);
  console.log("groupNameEntry: ", groupNameEntry);
  console.log("MESSAGE: ", strMsg);
    const m = JSON.parse(strMsg);
    if (m.instruction !== 'update') return;
    await window.ipfs.pubsub.unsubscribe(groupNameToTopic(groupNameEntry), updateHandler);
    setGroupCid(m.cid);
    setGroupName(m.groupName);
  }

  const openGroup = async () => {
    if (!groupNameEntry) {
      window.alert("Please enter a group name!");
      return;
    }
    const topic = groupNameToTopic(groupNameEntry);
    await window.ipfs.pubsub.subscribe(topic, updateHandler);
    const msg = JSON.stringify({instruction: 'broadcast', groupName: groupNameEntry});                 
    await window.ipfs.pubsub.publish(topic, msg);
console.log("Sent to topic: ", topic, "message", msg);
  }

  if (!address) return <></>;
  return (
    <Box width='80%' align='center' p={2} >
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>Group Name</FormLabel>
            <Input placeholder='Group Name' onChange={event => setGroupNameEntry(event.target.value)} />
            <br/><br/>
            <Button onClick={openGroup} >Open</Button>
        </Box>
        <Text>or</Text>
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>Group Name</FormLabel>
            <Input placeholder='Group Name' onChange={event => setGroupNameEntry(event.target.value)} />
            <FormLabel>My Name</FormLabel>
            <Input placeholder='My Name' onChange={event => setMyName(event.target.value)}  value={myName} />
            <br/><br/>
            <Button onClick={createGroup} >Create</Button> &nbsp;
            <Button onClick={joinGroup} >Join</Button>
        </Box>
    </Box>
  );
}

export default Select;
