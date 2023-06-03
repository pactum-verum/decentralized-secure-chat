import React from 'react';
import Message from './Message';

const ChatArea = ({ messages, ipfs }) => {
  return (
    <div className="chat-area">
      {messages.map((message, index) => (
        <Message key={index} message={message} ipfs={ipfs} />
      ))}
    </div>
  );
};

export default ChatArea;
