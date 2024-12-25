import React, {useEffect} from 'react';
import {List, ListItemButton, ListItemText} from '@mui/material';
import {Chat} from '../../types'
import {useStore} from '../../Store';
import ChatService from "../../services/ChatService";

interface Props {
    style?: React.CSSProperties;
}

const Chats: React.FC<Props> = (props) => {

    const {
        chats,
        selectedServer,
        currentUser,
        apiInited,
        setSelectedChat,
        setChats
    } = useStore();
    const chatService = new ChatService();

    useEffect(() => {
        if (selectedServer && apiInited) {
            chatService.read(0, 10, true)
                .then((result) => {
                    setChats(
                        result.data.chats?.sort((first: Chat, second: Chat) =>
                            first.last_active.localeCompare(second.last_active)
                        )
                    );
                });
        }
    }, [selectedServer, apiInited]);

    const getSecondary = (chat: Chat): string => {
        if (chat.last_msg_user == null && chat.last_msg_txt == null) return ''
        else if (chat.last_msg_user == null) return `${currentUser?.name}: ${chat.last_msg_txt}`
        else return `${chat.last_msg_user}: ${chat.last_msg_txt}`;
    }

    const onChatClick = (chat: Chat) => {
        setSelectedChat(chat);
    }

    return (
        <List style={{...props?.style, overflowY: 'auto'}}>
            {chats?.map((chat: Chat) => (
                <ListItemButton key={chat.id}
                                onClick={() => onChatClick(chat)}
                                sx={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                }}
                >
                    <ListItemText
                        primary={chat.name}
                        secondary={getSecondary(chat)}
                        classes={{primary: 'truncated-text', secondary: 'truncated-text'}}
                    />
                </ListItemButton>
            ))}
        </List>
    );
}

export default Chats;
