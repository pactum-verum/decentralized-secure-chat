import React from 'react';
import { Box, Text, FormLabel, Input, Button, useClipboard } from '@chakra-ui/react'
import createEmptyTree from '../utils/createEmptyTree';

const Select = ({ ipfs, address, signer, ecdh, setGroupCid }) => {
  const [cid, setCid] = React.useState(null);
  const [groupName, setGroupName] = React.useState('');
  const [myName, setMyName] = React.useState('');
  const membershipRequest = useClipboard('');

  React.useEffect(() => {
    createRequest(myName);
  }, []);

  const createGroup = async () => {
    const scid = await createEmptyTree(groupName, myName, ipfs, address, ecdh, signer);
    setGroupCid(scid); // Change this to unsigned cid; when do we need to sign the CIDs?
  }

  const createRequest = (name) => {
    if (!ecdh) return;
    setMyName(name); 
    const request = { alias: name, address: address, pubkey: ecdh.getPublicKey().toString('hex')};
    membershipRequest.setValue(JSON.stringify(request));
  }

  if (!address) return <></>;
  return (
    <Box width='80%' align='center' p={2} >
        <Box bg='gray.700' width='30%' justify='space-between' borderRadius='md' shadow='lg' align='center' p={2}>
            <FormLabel>Group CID</FormLabel>
            <Input placeholder='CID' onChange={event => setCid(event.target.value)} />
            <Button onClick={() => setGroupCid(cid)} >Open</Button>
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
