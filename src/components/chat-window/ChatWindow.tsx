import React, {RefObject, useEffect, useState} from 'react';
import './ChatWindow.css';
import {
    IconButton,
    List,
    ListItem,
    Paper,
    TextField,
    ListItemText,
    Typography,
    Toolbar,
    Menu,
    MenuItem, AppBar
} from "@mui/material";
import UserMessage from "../message/UserMessage";
import {internalApiUrl} from "../../config";
import AddLinkIcon from '@mui/icons-material/AddLink';
import axios from "axios";
import {Chat, Message, File, User} from '../../types'
import SettingsIcon from "@mui/icons-material/Settings";

interface Props {
    currentUser: User;
    selectedChat: Chat;
    setSelectedChat: (chat: Chat) => void;
    deleteChat: (chat: Chat) => void;
}

export const apiUrl = process.env.apiUrl;

const ChatWindow: React.FC<Props> = (props) => {
    const [messages, setMessages]: [Message[], any] = useState([]);
    const [text, setText]: [string, (text: string) => void] = useState('');
    const [files, setFiles]: [File[], (files: File[]) => void] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef: RefObject<any> = React.createRef();
    const messagesRef: RefObject<any> = React.createRef();
    const [offset, setOffset]: [bigint, React.Dispatch<React.SetStateAction<bigint>>] = useState(0n);
    const [idsSet, setIdsSet] = useState(new Set());
    const interval = 5000;
    const limit = 20n;

    useEffect(() => {
        setOffset(0n);
        setIdsSet(new Set());
        setMessages([]);
    }, [props.selectedChat]);

    useEffect(() => {
        if (!props.selectedChat) return;
        const fetchNewMessages = async () => {
            try {
                const [response] = await Promise.all([axios.get(`${apiUrl}/api/msgs/chat/?chat_id=${props.selectedChat.id}&offset=0&limit=${limit}`)]);
                const messages = response.data.msgs || [];
                messages
                    .filter(msg => !idsSet.has(msg.id))
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .forEach(msg => {
                        setMessages(prev => [...prev, msg]);
                        setIdsSet((prev) => prev.add(msg.id));
                    });
            } catch (error) {
                console.error('Error fetching new messages:', error);
            }
        };
        const intervalId = setInterval(fetchNewMessages, interval);
        return () => clearInterval(intervalId);
    }, [props.selectedChat, idsSet, messages, interval]);

    // useEffect(() => {
    //     if (!messagesRef.current) return;
    //     const { scrollHeight, clientHeight } = messagesRef.current;
    //     console.log(`Checking: ${scrollHeight < clientHeight}, scrollHeight: ${scrollHeight}, clientHeight: ${clientHeight}`);
    //     if (props.selectedChat != null && scrollHeight == clientHeight) {
    //         incrementOffsetAndGetMessages();
    //     }
    // }, [messages]);

    const handleScroll = () => {
        if (!messagesRef.current) return;
        const {scrollTop, scrollHeight, clientHeight} = messagesRef.current;

        if (scrollTop === 0) {
            incrementOffsetAndGetMessages();
        }
        if (scrollHeight - scrollTop === clientHeight) {
            setOffset(0n);
        }
    }

    const incrementOffsetAndGetMessages = () => {
        const newOffset = offset + limit;
        setOffset(newOffset);
        axios.get(`${apiUrl}/api/msgs/chat/?chat_id=${props.selectedChat.id}&offset=${newOffset}&limit=${limit}`)
            .then((response) => {
                const messages = response.data.msgs || [];
                messages
                    .filter(msg => !idsSet.has(msg.id))
                    // .sort((a, b) => a.time.localeCompare(b.time))
                    .forEach(msg => {
                        setMessages(prev => [msg, ...prev]);
                        setIdsSet((prev) => new Set(prev).add(msg.id));
                    });
            })
            .catch(error => console.error('Error loading messages:', error));
    }

    const handleSendMessage = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    const handleAddFile = (event) => {
        const formData = new FormData();
        const uploadedFiles = event.target.files;

        if (uploadedFiles.length !== 0) {
            for (let uploadedFile of uploadedFiles) {
                formData.append('files', uploadedFile);
            }
            axios.post(`${internalApiUrl}/api/uploadfiles`, formData)
                .then(response => response.data.forEach(file => setFiles([...files, file])))
                .catch(error => console.error('Error adding file: ', error))
        }
    }

    const sendMessage = () => {
        const requests = [];
        const messagesToStore: Message[] = files.map(file => {
            const body: File = {
                name: file.name,
                path: file.path,
                chat: props.selectedChat.id,
                text: text
            };
            requests.push(
                axios
                    .post(`${apiUrl}/api/msg/file/`, JSON.stringify(body))
                    .then((resp) => {
                        body.id = resp.data.msg_id;
                    })
            );
            const bodyToStore: Message = {
                path: body.path,
                name: body.name,
                chat: body.chat,
                text: body.text,
                file: {name: body.name}
            };
            props.selectedChat.last_msg_txt = bodyToStore.name;
            return bodyToStore;
        });

        if (text !== '') {
            let body: Message = {
                chat_id: props.selectedChat.id,
                text: text
            };
            props.selectedChat.last_msg_txt = text;
            messagesToStore.push(body);
            requests.push(axios.post(`${apiUrl}/api/msgs/text/`, JSON.stringify(body)));
        }

        Promise.all(requests)
            .then(() => {
                // setMessages([...messages, ...messagesToStore]);
                setFiles([]);
                setText('');
                // setIsUserScrolledUp(false);
            })
            .catch(error => console.error('Error sending message: ', error));
    }

    const handleIconButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleMenuClick = (event, index: number) => {
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                axios.post(`${apiUrl}/api/chats/moderate/?id=${props.selectedChat.id}&action=del`)
                    .then(() => {
                        props.deleteChat(props.selectedChat);
                        props.setSelectedChat(null);
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

    return (
        <div>
            {props.selectedChat !== null &&
                <AppBar position="static">
                    <Toolbar className="chat-toolbar">
                        <IconButton edge="start" aria-label="menu"
                                    onClick={(event) => handleMenuClick(event, -1)}>
                            <SettingsIcon/>
                        </IconButton>
                        <Menu
                            id="simple_menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                onClick={(event) => handleMenuClick(event, 0)}>Delete</MenuItem>
                        </Menu>
                        <Typography variant="h6">
                            {props.selectedChat?.name}
                        </Typography>
                    </Toolbar>
                </AppBar>
            }
            <Paper className="chat-window">
                {
                    <List className="messages" onScroll={handleScroll} ref={messagesRef}>
                        {messages?.map((message, index) =>
                            <ListItem
                                key={index}
                                className={`message-container ${message.sender === props.currentUser?.id ? 'message-right' : 'message-left'}`}
                            >
                                <UserMessage message={message}/>
                            </ListItem>
                        )}
                    </List>
                }
                {
                    files.length !== 0 &&
                    <Paper>
                        <ul className="preview-container">
                            {files.map((file, index) =>
                                <li className="image-preview-wrapper" key={index}>
                                    <img
                                        className="image-preview"
                                        src={file.name}
                                        alt={file.name}
                                        onError={(e) => console.error(e)}
                                    />
                                </li>
                            )}
                        </ul>
                    </Paper>
                }
                {
                    props.selectedChat != null &&
                    <div className="input">
                        <TextField
                            fullWidth
                            className="input"
                            variant="outlined"
                            label="Type a message..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={handleSendMessage}
                        />
                        <label htmlFor="upload-image">
                            <IconButton edge="start" onClick={handleIconButtonClick}>
                                <AddLinkIcon/>
                            </IconButton>
                            <input
                                id="upload-image"
                                hidden accept="*/*"
                                multiple
                                type="file"
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
