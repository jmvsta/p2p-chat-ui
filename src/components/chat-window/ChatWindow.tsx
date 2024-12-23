import React, {RefObject, useEffect, useState} from 'react';
import './ChatWindow.css';
import {AppBar, IconButton, Menu, MenuItem, Paper, TextField, Toolbar, Typography,} from '@mui/material';
import UserMessage from '../message/UserMessage';
import AddLinkIcon from '@mui/icons-material/AddLink';
import SettingsIcon from '@mui/icons-material/Settings';
import {useStore} from '../../Store';
import InfiniteScroll from 'react-infinite-scroll-component';
import MessageService from "../../services/MessageService";
import FileService from "../../services/FileService";
import ChatService from "../../services/ChatService";

interface Props {
    style?: React.CSSProperties;
}

const ChatWindow: React.FC<Props> = (props) => {

    const [text, setText] = useState('');
    const [blobs, setBlobs] = useState<Blob[]>([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef: RefObject<any> = React.createRef();
    const [offset, setOffset] = useState<bigint>(0n);
    const selectedChat = useStore((state) => state.selectedChat);
    const idsSet = useStore((state) => state.idsSet);
    const addIdsToSet = useStore((state) => state.addIdsToSet);
    const messages = useStore((state) => state.messages);
    const appendMessagesTail = useStore((state) => state.appendMessagesTail);
    const setSelectedChat = useStore((state) => state.setSelectedChat);
    const deleteChat = useStore((state) => state.deleteChat);
    const me = useStore((state) => state.currentUser);
    const users = useStore((state) => state.contacts);
    const limit = 10n;
    const messageService = new MessageService();
    const fileService = new FileService();
    const chatService = new ChatService();

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(0n);
        }
    }, [selectedChat]);

    const fetchMessages = (newOffset: bigint) => {
        setOffset(newOffset);
        messageService.read(selectedChat.id, newOffset, limit)
            .then((response) => {
                const fetchedMessages = response.data.msgs || [];
                const newMessages = fetchedMessages
                    .filter((msg) => !idsSet.has(msg.id))
                appendMessagesTail(newMessages);
                addIdsToSet(newMessages.map((msg) => msg.id));
            })
            .catch((error) => console.error('Error loading messages:', error));
    };

    const handleSendMessage = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleAddFile = (event) => {
        const files = event.target.files;
        if (!files) return;
        const blobs: Blob[] = Array.from(files);
        setBlobs((prevBlobs) => [...prevBlobs, ...blobs]);
    };

    const sendMessage = () => {
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

    const handleMenuClick = (event, index: number) => {
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                chatService.delete(selectedChat.id)
                    .then(() => {
                        deleteChat(selectedChat);
                        setSelectedChat(null);
                    })
                    .catch(error => console.error('f: ', error));
                setAnchorEl(null);
                break;
            default:
                break;
        }
    };

    return (
        <div style={{...props.style}}>
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
                                onClick={(event) => handleMenuClick(event, 0)}>Delete</MenuItem>
                        </Menu>
                        <Typography variant='h6'>{selectedChat?.name}</Typography>
                    </Toolbar>
                </AppBar>
            )}
            <div id='scrollableMessages' style={{overflow: 'auto'}}>
                <InfiniteScroll
                    className={'messages'}
                    dataLength={messages.length}
                    scrollableTarget={'scrollableMessages'}
                    next={() => fetchMessages(offset + limit)}
                    hasMore={true}
                    loader={''}
                >
                    {messages.map((message, index) => {
                        const user =
                            message.sender != null
                                ? users.find((u) => u.id === message.sender)
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
                <Paper>
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
                </Paper>
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
