import React from 'react';
import { Box, Text, FormLabel, Input, Button } from '@chakra-ui/react'

const GroupSelect = ({ signer, setGroupCid }) => {
  const [cid, setCid] = React.useState(null);
  const [groupName, setGroupName] = React.useState(null);
  const [myName, setMyName] = React.useState(null);

  const create = async () => {
    setGroupCid(groupName + myName);
  }

  return (
    <Box width='30%' align='center' p={2} >
        <Box display="flex" alignItems="center">
            <FormLabel>Group CID</FormLabel>
            <Input placeholder='CID' onChange={event => setCid(event.target.value)} />
            <Button onClick={() => setGroupCid(cid)} >Open</Button>
        </Box>
        <Text>or</Text>
        <Box display="flex" alignItems="center">
            <FormLabel>Group Name</FormLabel>
            <Input placeholder='Group Name' onChange={event => setGroupName(event.target.value)} />
            <FormLabel>My Name</FormLabel>
            <Input placeholder='My Name' onChange={event => setMyName(event.target.value)} />
            <Button onClick={create} >Create</Button>
        </Box>
    </Box>
  );
}

export default GroupSelect;
