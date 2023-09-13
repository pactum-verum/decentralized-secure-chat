import React from 'react';
import Message from './Message';
import { Box, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'

const NewMessage = ({ user, messages, setMessages }) => {
    const [message, setMessage] = React.useState("");

    const sendMessage = async () => {
        const newMessages = [...messages];
        newMessages.push({ user: user, text: message, attachments: [] });
        setMessages(newMessages);
        setMessage("");
    }

    return (
        <InputGroup >
            <Input placeholder='new message' value={message} onChange={event => setMessage(event.target.value)} />
            <InputRightElement>
                <Button onClick={sendMessage} >></Button>
            </InputRightElement>
        </InputGroup>
    );
};

export default NewMessage;
