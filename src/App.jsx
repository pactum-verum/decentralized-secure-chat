import React from 'react';
import './App.css';
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Titlebar from './components/Titlebar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Select from './components/Select';

const App = ({ipfs}) => {
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
  return (<Box bg='black' w='100%' h='100%' p={4} color='white'>
      <Titlebar setSigner={setSigner} groupName={groupName} setGroupName={setGroupName} setGroupCid={setGroupCid} setEcdh={setEcdh} />
      {ecdh?
      (!groupCid?
      <Select address={address} signer={signer} ecdh={ecdh} setGroupName={setGroupName} setGroupCid={setGroupCid} />
      :
      <Grid width='100%'>
          <GridItem rowStart={1} colSpan={1}  bg='black'>
              <Sidebar users={users} />
          </GridItem>
          <GridItem rowStart={1} colSpan={19}  bg='black'>
              <ChatArea messages={messages} />
          </GridItem>
      </Grid>):''}
  </Box>);
};

export default App;
