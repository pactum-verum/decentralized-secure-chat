import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const App = ({ipfs}) => {
  // Replace these with your actual data from the backend
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

  return (
    <div className="app">
      <Sidebar users={users} ipfs={ipfs} />
      <ChatArea messages={messages} ipfs={ipfs} />
    </div>
  );
};

export default App;
