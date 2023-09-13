import React from 'react';
import './App.css';
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Titlebar from './components/Titlebar';
import Group from './components/Group';
import Select from './components/Select';

const App = () => {
  const [signer, setSigner] = React.useState(null);
  const [groupCid, setGroupCid] = React.useState(null);
  const [groupName, setGroupName] = React.useState(null);
  const [ecdh, setEcdh] = React.useState(null);
  const [address, setAddress] = React.useState(null);

  React.useEffect(() => {
    if (!signer) return;
    (async () => {
      setAddress(await signer.getAddress());
    }) ();
  }, [signer]);

  return (<Box bg='black' w='100%' h='100%' p={4} color='white'>
      <Titlebar setSigner={setSigner} groupName={groupName} setGroupName={setGroupName} setGroupCid={setGroupCid} setEcdh={setEcdh} />
      {ecdh?
      (!groupCid?
        <Select address={address} signer={signer} ecdh={ecdh} setGroupName={setGroupName} setGroupCid={setGroupCid} />
        :
        <Group address={address} signer={signer} ecdh={ecdh} groupName={groupName} setGroupName={setGroupName} groupCid={groupCid} setGroupCid={setGroupCid} />
      ):''}
  </Box>);
};

export default App;
