import React, {RefObject, useState} from 'react';
import './ChatWindow.css';
import {AppBar, IconButton, Menu, MenuItem, Paper, TextField, Toolbar, Typography,} from '@mui/material';
import UserMessage from '../message/UserMessage';
import AddLinkIcon from '@mui/icons-material/AddLink';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import useStore, {messageComparator} from '../../Store';
import InfiniteScroll from 'react-infinite-scroll-component';

export const apiUrl = process.env.apiUrl;

const ChatWindow: React.FC = () => {

    const [text, setText] = useState('');
    const [blobs, setBlobs] = useState<Blob[]>([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef: RefObject<any> = React.createRef();
    const [offset, setOffset] = useState<bigint>(0n);
    const selectedChat = useStore((state) => state.selectedChat);
    const idsSet = useStore((state) => state.idsSet);
    const addIdsToSet = useStore((state) => state.addIdsToSet);
    const messages = useStore((state) => state.messages);
    const appendMessagesHead = useStore((state) => state.appendMessagesHead);
    const setSelectedChat = useStore((state) => state.setSelectedChat);
    const deleteChat = useStore((state) => state.deleteChat);
    const me = useStore((state) => state.currentUser);
    const users = useStore((state) => state.contacts);
    const limit = 10n;

    const incrementOffsetAndGetMessages = (newOffset: bigint) => {
        setOffset(newOffset);
        axios
            .get(`${apiUrl}/api/msgs/chat/?chat_id=${selectedChat.id}&offset=${newOffset}&limit=${limit}`)
            .then((response) => {
                const fetchedMessages = response.data.msgs || [];
                const newMessages = fetchedMessages
                    .filter((msg) => !idsSet.has(msg.id))
                    .sort(messageComparator);
                appendMessagesHead(newMessages);
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
            const body = {
                chat_id: selectedChat.id,
                text: text,
            };
            requests.push(axios.post(`${apiUrl}/api/msgs/text/`, JSON.stringify(body)));
        }

        Promise.all(requests)
            .then(() => {
                setBlobs([]);
                setText('');
            })
            .catch((error) => console.error('Error sending message: ', error));
    };

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
    };

    return (
        <div>
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
            <Paper className='chat-window'>
                <div id='messages' className='messages'>
                    {<InfiniteScroll
                        className={'infinite-scroll'}
                        scrollableTarget='messages'
                        dataLength={1000}
                        next={() => incrementOffsetAndGetMessages(offset + limit)}
                        hasMore={true}
                        loader={''}
                        inverse={true}
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
                    </InfiniteScroll>}
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
            </Paper>
        </div>
    );
}

export default ChatWindow;
