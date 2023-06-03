import React from 'react';
import { Text } from '@chakra-ui/react'

const User = ({ name }) => {
  return <Text bg='gray.700' borderRadius='md' shadow='lg'>{name}</Text>;
};

export default User;
