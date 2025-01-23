import React, {RefObject, useEffect, useState} from 'react';
import './ChatWindow.css';
import {AppBar, IconButton, Menu, MenuItem, Box, TextField, Toolbar, Typography,} from '@mui/material';
import UserMessage from '../message/UserMessage';
import AddLinkIcon from '@mui/icons-material/AddLink';
import SettingsIcon from '@mui/icons-material/Settings';
import {useStore} from '../../Store';
import InfiniteScroll from 'react-infinite-scroll-component';
import {ExtUser, Message} from '../../types';
import {useServices} from '../../services/ServiceProvider';

interface Props {
    style?: React.CSSProperties;
}

const ChatWindow: React.FC<Props> = (props) => {

    const [text, setText] = useState('');
    const [blobs, setBlobs] = useState<Blob[]>([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef: RefObject<any> = React.createRef();
    const [offset, setOffset] = useState<number>(0);
    const selectedChat = useStore((state) => state.selectedChat);
    const idsSet = useStore((state) => state.idsSet);
    const addIdsToSet = useStore((state) => state.addIdsToSet);
    const messages = useStore((state) => state.messages);
    const appendMessagesTail = useStore((state) => state.appendMessagesTail);
    const setSelectedChat = useStore((state) => state.setSelectedChat);
    const deleteChat = useStore((state) => state.deleteChat);
    const me = useStore((state) => state.currentUser);
    const {contacts, showChatPopup} = useStore();
    const limit = 10;
    const {messageService, fileService, chatService} = useServices();

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(0);
        }
    }, [selectedChat]);

    const fetchMessages = (newOffset: number) => {
        setOffset(newOffset);
        if (selectedChat) {
            messageService.read(selectedChat.id, newOffset, limit)
                .then((response) => {
                    const fetchedMessages = response.data.msgs || [];
                    const newMessages = fetchedMessages
                        .filter((msg: Message) => !idsSet.has(msg.id))
                    appendMessagesTail(newMessages);
                    addIdsToSet(newMessages.map((msg: Message) => msg.id));
                })
                .catch((error) => console.error('Error loading messages:', error));
        }
    };

    const handleSendMessage = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleAddFile = (event: any) => {
        const files = event.target.files;
        if (!files) return;
        const blobs: Blob[] = Array.from(files);
        setBlobs((prevBlobs) => [...prevBlobs, ...blobs]);
    };

    const sendMessage = () => {
        if (!selectedChat) return;
        const requests = [];
        blobs?.forEach((file) => {
            requests.push(fileService.create(file, selectedChat.id));
        });

        if (text !== '') {
            requests.push(messageService.create(selectedChat.id, text));
        }

        Promise.all(requests)
            .catch((error) => console.error('Error sending message: ', error))
            .finally(() => {
                setBlobs([]);
                setText('');
            })
    };

    const handleMenuClick = (event: any, index: number) => {
        if (!selectedChat) return;
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                showChatPopup('UPDATE', selectedChat, 'Update chat');
                setAnchorEl(null);
                break;
            case 1:
                chatService.ban(selectedChat.id)
                    .then(() => {
                    //     TODO: behaviour on ban
                    })
                    .catch(error => console.error('f: ', error));
                setAnchorEl(null);
                break;
            case 2:
                chatService.delete(selectedChat.id)
                    .then(() => {
                        deleteChat(selectedChat);
                        setSelectedChat(null);
                    })
                    .catch(error => console.error('f: ', error));
                setAnchorEl(null);
                break;
        }
    };

    return (
        <div style={{...props.style, display: 'flex', flexDirection: 'column', height: '100%'}}>
            {selectedChat !== null && (
                <AppBar position='static'>
                    <Toolbar className='chat-toolbar'>
                        <IconButton
                            edge='start'
                            aria-label='menu'
                            onClick={(event) => handleMenuClick(event, -1)}
                        >
                            <SettingsIcon/>
                        </IconButton>
                        <Menu
                            id='simple_menu'
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem
                                onClick={(event) => handleMenuClick(event, 0)}>Edit</MenuItem>
                            <MenuItem
                                onClick={(event) => handleMenuClick(event, 1)}>Ban</MenuItem>
                            <MenuItem
                                onClick={(event) => handleMenuClick(event, 2)}>Delete</MenuItem>
                        </Menu>
                        <Typography variant='h6'>{selectedChat?.name}</Typography>
                    </Toolbar>
                </AppBar>
            )}
            <div id='scrollableMessages' className={'messages'}>
                <InfiniteScroll
                    className={'messages'}
                    dataLength={messages.length}
                    scrollableTarget={'scrollableMessages'}
                    next={() => fetchMessages(offset + limit)}
                    hasMore={true}
                    loader={''}
                    inverse={true}
                >
                    {messages.map((message: Message, index: number) => {
                        const user: ExtUser | undefined | null =
                            message.sender != null
                                ? contacts.find((u) => u.id === message.sender)
                                : me;
                        return (
                            <div className='message' key={index}>
                                <UserMessage message={message} user={user}/>
                            </div>
                        );
                    })}
                </InfiniteScroll>
            </div>
            {blobs.length !== 0 && (
                <Box>
                    <ul className='preview-container'>
                        {blobs.map((file, index) => {
                            const blobUrl = URL.createObjectURL(file);
                            return (
                                <li className='image-preview-wrapper' key={index}>
                                    <div className='image-container'>
                                        <img
                                            className='image-preview'
                                            src={blobUrl}
                                            alt={`File ${index}`}
                                            onLoad={() => URL.revokeObjectURL(blobUrl)}
                                            onError={(e) => console.error(e)}
                                        />
                                        <button
                                            className='remove-button'
                                            onClick={() =>
                                                setBlobs((prevBlobs) =>
                                                    prevBlobs.filter((_, i) => i !== index)
                                                )
                                            }
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Box>
            )}
            {selectedChat != null && (
                <div className='input'>
                    <TextField
                        fullWidth
                        className='input'
                        variant='outlined'
                        label='Type a message...'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleSendMessage}
                    />
                    <label htmlFor='upload-image'>
                        <IconButton edge='start' onClick={() => fileInputRef.current.click()}>
                            <AddLinkIcon/>
                        </IconButton>
                        <input
                            id='upload-image'
                            hidden
                            accept='*/*'
                            multiple
                            type='file'
                            ref={fileInputRef}
                            onChange={handleAddFile}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}

export default ChatWindow;
