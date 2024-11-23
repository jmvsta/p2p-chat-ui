import './Chats.css'
import React, {useEffect, useState} from 'react';
import {List, ListItemButton, ListItemText} from "@mui/material";
import axios from "axios";
import {Chat} from '../../types'

interface Props {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    setSelectedChat: (chat: Chat) => void;
}

export const apiUrl = process.env.apiUrl;

const Chats: React.FC<Props> = (props) => {
    // const [chats, setChats] = useState([]);
    const interval = 5000;

    const handleClick = (chat: Chat) => props.setSelectedChat(chat);

    useEffect(() => {
        const fetchNewChatsAndLastMessages = async () => {
            try {
                const [response] = await Promise.all([axios.get(`${apiUrl}/api/chats/list/?offset=-1&limit=10&filter_banned=false`)]);
                props.setChats(response.data.chats.sort((a, b) => a.last_active.localeCompare(b.last_active)));
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };
        const intervalId = setInterval(fetchNewChatsAndLastMessages, interval);
        return () => clearInterval(intervalId);
    }, [props.chats, interval]);

    // const deleteChat = (chat: Chat) => {
    //     setChats(prevItems => prevItems.filter(item => item !== chat))
    // }

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
