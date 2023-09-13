import React from 'react';
import { Box, Text } from '@chakra-ui/react'
import Attachment from './Attachment';
import decryptBuffer from '../utils/decryptBuffer';

const Message = ({ message, commonKey }) => {
  const ciphertextBuffer = Buffer.from(message.text, 'hex');
  const cleartextBuffer = decryptBuffer(ciphertextBuffer, commonKey);
  const cleartextString = cleartextBuffer.toString('utf-8');
  return (
    <Box bg='gray.700' borderRadius='md' shadow='lg'>
      <Text>{message.user}:</Text>
      <Text>{cleartextString}</Text>
      {message.attachments.map((attachment, index) => (
        <Attachment key={index} attachment={attachment} />
      ))}
    </Box>
  );
};

export default Message;
