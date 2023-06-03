import React from 'react';
import Attachment from './Attachment';

const Message = ({ message, ipfs }) => {
  return (
    <div className="message">
      <div className="message-user">{message.user}</div>
      <div className="message-text">{message.text}</div>
      {message.attachments.map((attachment, index) => (
        <Attachment key={index} attachment={attachment} ipfs={ipfs} />
      ))}
    </div>
  );
};

export default Message;
