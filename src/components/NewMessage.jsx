import React from 'react';
import Message from './Message';
import { Box, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import encryptBuffer from '../utils/encryptBuffer';

const NewMessage = ({ user, messages, setMessages, commonKey }) => {
    const [message, setMessage] = React.useState("");

    const sendMessage = async () => {
        const newMessages = [...messages];
        const cleartextBuffer = Buffer.from(message, 'utf-8');
        const ciphertextBuffer = encryptBuffer(cleartextBuffer, commonKey);
        const ciphertextString = ciphertextBuffer.toString('hex');
        newMessages.push({ user: user, text: ciphertextString, attachments: [] });
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
