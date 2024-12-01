import React, {RefObject, useEffect, useState} from 'react';
import './ChatWindow.css';
import {AppBar, IconButton, List, ListItem, Menu, MenuItem, Paper, TextField, Toolbar, Typography} from '@mui/material';
import UserMessage from '../message/UserMessage';
import AddLinkIcon from '@mui/icons-material/AddLink';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import useStore, {messageComparator} from '../../Store';

export const apiUrl = process.env.apiUrl;

const ChatWindow: React.FC = () => {

    const [text, setText]: [string, (text: string) => void] = useState('');
    const [blobs, setBlobs] = useState<Blob[]>([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef: RefObject<any> = React.createRef();
    const messagesRef: RefObject<any> = React.createRef();
    const [offset, setOffset]: [bigint, React.Dispatch<React.SetStateAction<bigint>>] = useState(0n);
    const selectedChat = useStore((state) => state.selectedChat);
    const idsSet = useStore((state) => state.idsSet);
    const addIdsToSet = useStore((state) => state.addIdsToSet);
    const messages = useStore((state) => state.messages);
    const appendMessagesHead = useStore((state) => state.appendMessagesHead);
    const setSelectedChat = useStore((state) => state.setSelectedChat);
    const deleteChat = useStore((state) => state.deleteChat);
    const limit = 10n;

    useEffect(() => {
        setBlobs([]);
        if (selectedChat != null) {
            incrementOffsetAndGetMessages(0n);
        }
    }, [selectedChat]);

    const handleScroll = () => {

        if (!messagesRef.current) return;
        const {scrollTop, scrollHeight, clientHeight} = messagesRef.current;

        if (scrollTop === 0) {
            incrementOffsetAndGetMessages(offset + limit);
        }
        if (scrollHeight - scrollTop === clientHeight) {
            setOffset(0n);
        }
        const newScrollHeight = messagesRef.current.scrollHeight;
        messagesRef.current.scrollTop = scrollTop + (newScrollHeight - scrollHeight);
    };

    const incrementOffsetAndGetMessages = (newOffset) => {
        setOffset(newOffset);
        axios.get(`${apiUrl}/api/msgs/chat/?chat_id=${selectedChat.id}&offset=${newOffset}&limit=${limit}`)
            .then((response) => {
                const messages = response.data.msgs || [];
                const newMessages = messages
                    .filter(msg => !idsSet.has(msg.id))
                    .sort(messageComparator)
                appendMessagesHead(newMessages);
                addIdsToSet(newMessages.map(msg => msg.id));
            })
            .catch(error => console.error('Error loading messages:', error));
    }

    const handleSendMessage = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    const handleAddFile = (event) => {
        const files = event.target.files;
        if (!files) return;
        const blobs: Blob[] = Array.from(files);
        setBlobs((prevBlobs) => [...prevBlobs, ...blobs]);
    }

    const sendMessage = () => {
        const requests = [];
        blobs?.map(file => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('chat_id', selectedChat.id);
            requests.push(
                axios
                    .post(`${apiUrl}/api/msgs/file/`, formData, {
                        headers: {'Content-Type': 'multipart/form-data'},
                    })
                    .then((resp) => {
                        console.log('File added successfully', resp);
                    })
                    .catch((error) => {
                        console.error('Error adding new file', error);
                    })
            );
        });

        if (text !== '') {
            let body = {
                chat_id: selectedChat.id,
                text: text
            };
            requests.push(axios.post(`${apiUrl}/api/msgs/text/`, JSON.stringify(body)));
        }

        Promise.all(requests)
            .then(() => {
                setBlobs([]);
                setText('');
            })
            .catch(error => console.error('Error sending message: ', error));
    }

    const handleIconButtonClick = () => fileInputRef.current.click();

    const handleMenuClick = (event, index: number) => {
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                axios.post(`${apiUrl}/api/chats/moderate/?id=${selectedChat.id}&action=del`)
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
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const removeImage = (index: number) => {
        setBlobs((prevBlobs) => prevBlobs.filter((_, i) => i !== index));
    };

    return (
        <div>
            {selectedChat !== null &&
                <AppBar position='static'>
                    <Toolbar className='chat-toolbar'>
                        <IconButton edge='start' aria-label='menu'
                                    onClick={(event) => handleMenuClick(event, -1)}>
                            <SettingsIcon/>
                        </IconButton>
                        <Menu
                            id='simple_menu'
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                onClick={(event) => handleMenuClick(event, 0)}>Delete</MenuItem>
                        </Menu>
                        <Typography variant='h6'>
                            {selectedChat?.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
            }
            <Paper className='chat-window'>
                {
                    <List className='messages' onScroll={handleScroll} ref={messagesRef}>
                        {messages?.map((message, index) =>
                            <ListItem className='message-container' key={index}>
                                <UserMessage message={message}/>
                            </ListItem>
                        )}
                    </List>
                }
                {
                    blobs.length !== 0 &&
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
                                                <button className='remove-button' onClick={() => removeImage(index)}>
                                                    &times;
                                                </button>
                                            </div>
                                        </li>)
                                }
                            )}
                        </ul>
                    </Paper>
                }
                {
                    selectedChat != null &&
                    <div className='input'>
                        <TextField
                            fullWidth
                            className='input'
                            variant='outlined'
                            label='Type a message...'
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={handleSendMessage}
                        />
                        <label htmlFor='upload-image'>
                            <IconButton edge='start' onClick={handleIconButtonClick}>
                                <AddLinkIcon/>
                            </IconButton>
                            <input
                                id='upload-image'
                                hidden accept='*/*'
                                multiple
                                type='file'
                                ref={fileInputRef}
                                onChange={handleAddFile}/>
                        </label>
                    </div>
                }
            </Paper>
        </div>
    );
}

export default ChatWindow;
