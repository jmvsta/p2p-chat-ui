import './Chats.css'
import React from 'react';
import {List, ListItemButton, ListItemText} from "@mui/material";
import {apiUrl} from "../../config";
import axios from "axios";
import {Chat, Message} from '../../types'

interface Props {
    chats: Chat[];
    setSelectedChat: (chat: Chat) => void;
    setMessages: (messages: Message[]) => void;
}

const Chats: React.FC<Props> = (props) => {

    const handleClick = (chat: Chat) => {
        props.setSelectedChat(chat)
        axios.get(`${apiUrl}/api/chats/msgs/?chat=${chat.id}`)
            .then((response) => props.setMessages(response.data.data))
            .catch(error => console.error('Chats request error:', error));
    }

    return (
        <List className="chats">
            {props.chats?.map((chat) => (
                <ListItemButton className="chat-item" key={chat.id} onClick={() => handleClick(chat)}>
                    <ListItemText
                        primary={chat.name}
                        secondary={chat.last_msg}
                        classes={{primary: 'truncated-text', secondary: 'truncated-text'}}
                    />
                </ListItemButton>
            ))}
        </List>
    );
}

export default Chats;
