import React, {useEffect} from 'react';
import {Avatar, List, ListItemButton, ListItemText} from '@mui/material';
import {Chat} from '../../types'
import {useStore} from '../../Store';
import {useServices} from '../../Providers';
import {chatsComparator} from '../../services/ChatService';

interface Props {
    style?: React.CSSProperties;
}

const Chats: React.FC<Props> = (props) => {

    const chats = useStore((state) => state.chats);
    const currentUser = useStore((state) => state.currentUser);
    const apiInited = useStore((state) => state.apiInited);
    const setSelectedChat = useStore((state) => state.setSelectedChat);
    const setChats = useStore((state) => state.setChats);
    const {chatService} = useServices()

    useEffect(() => {
        if (apiInited) {
            chatService.read(0, 1000, true)
                .then((result) => {
                    setChats(result.data.chats?.sort(chatsComparator));
                });
        }
    }, [apiInited]);

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
                    <Avatar
                        src={''}
                        alt='avatar'
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'black',
                        }}
                    />
                    <ListItemText
                        sx={{
                            marginLeft: '1rem',
                            '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                display: 'block',
                            },
                        }}
                        primary={chat.name}
                        secondary={getSecondary(chat)}
                    />
                </ListItemButton>
            ))}
        </List>
    );
}

export default Chats;
