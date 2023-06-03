import React from 'react';
import './App.css';
import { Box, Grid, GridItem } from '@chakra-ui/react'
import Titlebar from './components/Titlebar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import GroupSelect from './components/GroupSelect';

const App = ({ipfs}) => {
  const [signer, setSigner] = React.useState(null);
  const [groupCid, setGroupCid] = React.useState(null);
  const [ecdh, setEcdh] = React.useState(null);

  // Replace these with your actual data from the backend
  const groupName = 'Our Group';

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
      <Titlebar setSigner={setSigner} groupName={groupName} groupCid={groupCid} setGroupCid={setGroupCid} setEcdh={setEcdh} />
      {ecdh?
      (!groupCid?
      <GroupSelect signer={signer} setGroupCid={setGroupCid} />
      :
      <Grid width='100%'>
          <GridItem rowStart={1} colSpan={1}  bg='black'>
              <Sidebar users={users} ipfs={ipfs} />
          </GridItem>
          <GridItem rowStart={1} colSpan={19}  bg='black'>
              <ChatArea messages={messages} ipfs={ipfs} />
          </GridItem>
      </Grid>):''}
  </Box>);
};

export default App;
