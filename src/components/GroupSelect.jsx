import React from 'react';
import { Box, Text, FormLabel, Input, Button } from '@chakra-ui/react'

const GroupSelect = ({ signer, setGroupCid }) => {
  const [cid, setCid] = React.useState(null);
  const [name, setName] = React.useState(null);

  const create = async () => {
    setGroupCid(name);
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
            <Input placeholder='Name' onChange={event => setName(event.target.value)} />
            <Button onClick={create} >Create</Button>
        </Box>
    </Box>
  );
}

export default GroupSelect;
