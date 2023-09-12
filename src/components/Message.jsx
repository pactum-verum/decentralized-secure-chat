import React from 'react';
import { Box, Text } from '@chakra-ui/react'
import Attachment from './Attachment';

const Message = ({ message, ipfs }) => {
  return (
    <Box bg='gray.700' borderRadius='md' shadow='lg'>
      <Text>{message.user}:</Text>
      <Text>{message.text}</Text>
      {message.attachments.map((attachment, index) => (
        <Attachment key={index} attachment={attachment} />
      ))}
    </Box>
  );
};

export default Message;
