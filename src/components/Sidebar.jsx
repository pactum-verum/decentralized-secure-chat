import React from 'react';
import { VStack } from '@chakra-ui/react'
import User from './User';

const Sidebar = ({ users }) => {
  return (
    <VStack align='left' p={2} >
    <br/>
      {users.map((user, index) => (
        <User key={index} name={user.name} />
      ))}
    </VStack>
  );
};

export default Sidebar;
