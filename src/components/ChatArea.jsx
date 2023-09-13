import React from 'react';
import Message from './Message';
import { VStack } from '@chakra-ui/react'

const ChatArea = ({ messages, commonKey }) => {
  return (
    <VStack align='left' p={2} >
        <br/>
        {messages.map((message, index) => (
            <Message key={index} message={message} commonKey={commonKey} />
        ))}
    </VStack>
  );
};

export default ChatArea;
