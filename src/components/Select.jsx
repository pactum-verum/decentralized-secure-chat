import React from 'react';
import { Box, Text, FormLabel, Input, Button, useClipboard } from '@chakra-ui/react'
import createEmptyGroup from '../utils/createEmptyGroup';

const Select = ({ ipfs, address, signer, ecdh, setGroup }) => {
  const [groupName, setGroupName] = React.useState('');
  const [myName, setMyName] = React.useState('');
  const membershipRequest = useClipboard('');

  const createGroup = async () => {
console.log("Creating group: ", groupName, myName)
    setGroupName(await createEmptyGroup(groupName, myName, ipfs, address, ecdh))
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

  if (!address) return <></>;
  return (
    <Box width='80%' align='center' p={2} >
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>Group Name</FormLabel>
            <Input placeholder='CID' onChange={event => setGroupName(event.target.value)} />
            <Button onClick={() => setGroup(groupName)} >Open</Button>
        </Box>
        <Text>or</Text>
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>Group Name</FormLabel>
            <Input placeholder='Group Name' onChange={event => setGroupName(event.target.value)} />
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
