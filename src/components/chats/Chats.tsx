import './Chats.css'
import React from 'react';
import {List, ListItemButton, ListItemText} from '@mui/material';
import {Chat} from '../../index.d'
import useStore from '../../Store';

const Chats: React.FC = () => {

    const chats = useStore((state) => state.chats);
    const setSelectedChat = useStore((state) => state.setSelectedChat);

    const handleClick = (chat: Chat) => setSelectedChat(chat);

    return (
        <List className='chats'>
            {chats?.map((chat: Chat) => (
                <ListItemButton className='chat-item' key={chat.id} onClick={() => handleClick(chat)}>
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
