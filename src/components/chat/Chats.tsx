import './Chats.css'
import React, {useEffect} from 'react';
import {List, ListItemButton, ListItemText} from "@mui/material";
import axios from "axios";
import {Chat, Message} from '../../types'

interface Props {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    setSelectedChat: (chat: Chat) => void;
    setMessages: (messages: Message[]) => void;
}

export const apiUrl = process.env.apiUrl;

const Chats: React.FC<Props> = (props) => {

    const interval = 5000;

    const handleClick = (chat: Chat) => {
        props.setSelectedChat(chat)
        axios.get(`${apiUrl}/api/msgs/chat/?chat_id=${chat.id}&offset=0`)
            .then((response) => props.setMessages(response.data.msgs))
            .catch(error => console.error('Chats request error:', error));
    }

    useEffect(() => {
        const fetchNewChatsAndLastMessages = async () => {
            try {
                const [response] = await Promise.all([axios.get(`${apiUrl}/api/chats/list`)]);
                props.setChats(response.data.chats);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };
        const intervalId = setInterval(fetchNewChatsAndLastMessages, interval);
        return () => clearInterval(intervalId);
    }, [interval]);

    return (
        <List className="chats">
            {props.chats?.map((chat) => (
                <ListItemButton className="chat-item" key={chat.id} onClick={() => handleClick(chat)}>
                    <ListItemText
                        primary={chat.name}
                        secondary={chat.last_msg_user !== null ? `${chat.last_msg_user}: ${chat.last_msg_txt}` : ''}
                        classes={{primary: 'truncated-text', secondary: 'truncated-text'}}
                    />
                </ListItemButton>
            ))}
        </List>
    );
}

export default Chats;
