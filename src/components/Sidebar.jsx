import React from 'react';
import { VStack } from '@chakra-ui/react'
import User from './User';

const Sidebar = ({ users }) => {

Object.keys(users).forEach(key => 
  console.log("key: ", key, "value: ", users[key])
);
  return (
    <VStack align='left' p={2} >
    <br/>
      {Object.entries(users).map(([key, user]) =>
        <User key={key} user={users[key]} />
      )}
    </VStack>
  );
};

export default Sidebar;
