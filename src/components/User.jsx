import React from 'react';
import { Text } from '@chakra-ui/react'

const User = ({ user }) => {
  return <Text bg='gray.700' borderRadius='md' shadow='lg'>{user.alias}</Text>;
};

export default User;
