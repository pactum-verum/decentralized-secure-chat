import React from 'react';
import { Box, Text, FormLabel, Input, Button, useClipboard } from '@chakra-ui/react'
import createEmptyGroup from '../utils/createEmptyGroup';
import groupNameToTopic from '../utils/groupNameToTopic';

const Select = ({ ipfs, address, signer, ecdh, setGroupName, setGroupCid }) => {
  const [groupNameEntry, setGroupNameEntry] = React.useState('');
  const [groupCidEntry, setGroupCidEntry] = React.useState('');
  const [myName, setMyName] = React.useState('');
  const membershipRequest = useClipboard('');

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
    setGroupCid(await createEmptyGroup(groupNameEntry, myName, ipfs, address, ecdh));
    await requestGroup(); // In case there is a group with the same name already.
  }

  const createRequest = (name) => {
    if (!ecdh) return;
    setMyName(name); 
    const request = { alias: name, address: address, pubkey: ecdh.getPublicKey().toString('hex')};
    membershipRequest.setValue(JSON.stringify(request));
  }

  React.useEffect(() => {
    createRequest(myName);
  }, [myName, createRequest]);

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

  const requestGroup = async () => {
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
            <FormLabel>Group CID</FormLabel>
            <Input placeholder='CID' onChange={event => setGroupCidEntry(event.target.value)} />
            <Button onClick={() => setGroupCid(groupCidEntry)} >Open</Button>
        </Box>
        <Text>or</Text>
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>Group Name</FormLabel>
            <Input placeholder='Group Name' onChange={event => setGroupNameEntry(event.target.value)} />
            <Button onClick={requestGroup} >Open</Button>
        </Box>
        <Text>or</Text>
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>Group Name</FormLabel>
            <Input placeholder='Group Name' onChange={event => setGroupNameEntry(event.target.value)} />
            <FormLabel>My Name</FormLabel>
            <Input placeholder='My Name' onChange={event => setMyName(event.target.value)}  value={myName} />
            <Button onClick={createGroup} >Create</Button>
        </Box>
        <Text>or</Text>
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>My Name</FormLabel>
            <Input placeholder='My Name' onChange={event => {createRequest(event.target.value)}} value={myName} />
            <FormLabel>Request</FormLabel>
            <Input placeholder='Request' isDisabled={true} value={membershipRequest.value} />
            <Button onClick={membershipRequest.onCopy} disabled={!membershipRequest.value} >{membershipRequest.hasCopied ? "Copied!" : "Copy"}</Button>
        </Box>
    </Box>
  );
}

export default Select;
