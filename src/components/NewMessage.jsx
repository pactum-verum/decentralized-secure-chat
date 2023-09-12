import React from 'react';
import Message from './Message';
import { Box, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'

const NewMessage = ({ messages, setMessages }) => {
    const [message, setMessage] = React.useState(null);

    const sendMessage = async () => {
console.log("messages", messages);
        const newMessages = [...messages];
        newMessages.push({ user: 'me', text: message, attachments: [] });
        setMessages(newMessages);
        setMessage(null);
    }

    return (
        <InputGroup >
            <Input placeholder='new message' onChange={event => setMessage(event.target.value)} />
            <InputRightElement>
                <Button onClick={sendMessage} >></Button>
            </InputRightElement>
        </InputGroup>
    );
};

export default NewMessage;
