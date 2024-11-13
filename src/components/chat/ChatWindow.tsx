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
    MenuItem, AppBar, Autocomplete
} from "@mui/material";
import {apiUrl, internalApiUrl} from "../../config";
import AddLinkIcon from '@mui/icons-material/AddLink';
import axios from "axios";
import {Chat, Message, File, User} from '../../types'
import SettingsIcon from "@mui/icons-material/Settings";

interface Props {
    currentUser: User;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    selectedChat: Chat;
    setSelectedChat: (chat: Chat) => void;
    deleteChat: (chat: Chat) => void;
}

const ChatWindow: React.FC<Props> = (props) => {

    const [text, setText]: [string, (text: string) => void] = useState('');
    const [files, setFiles]: [File[], (files: File[]) => void] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef: RefObject<any> = React.createRef();
    const messagesEndRef: RefObject<any> = React.createRef();
    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
    const interval = 5000;

    useEffect(() => {
        setIsUserScrolledUp(false);
    }, [props.selectedChat]);

    useEffect(() => {
        if (!isUserScrolledUp && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [props.messages]);

    useEffect(() => {
        if (!props.selectedChat) return;
        const fetchNewMessages = async () => {
            try {
                const [response] = await Promise.all([axios.get(`${apiUrl}/api/chats/msgs/?chat=${props.selectedChat.id}`)]);
                props.setMessages(response.data.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        const intervalId = setInterval(fetchNewMessages, interval);
        return () => clearInterval(intervalId);
    }, [props.selectedChat, interval]);

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
                .then((response) => response.data.forEach(file => setFiles([...files, file])))
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
            requests.push(axios.post(`${apiUrl}/api/msg/file/`, JSON.stringify(body)));
            const bodyToStore: Message = {
                path: body.path,
                name: body.name,
                chat: body.chat,
                text: body.text,
                file: {name: body.name}
            };
            props.selectedChat.last_msg = bodyToStore.name;
            return bodyToStore;
        });

        if (text !== '') {
            let body: Message = {
                chat: props.selectedChat.id,
                text: text
            };
            props.selectedChat.last_msg = text;
            messagesToStore.push(body);
            requests.push(axios.post(`${apiUrl}/api/msgs/text/`, JSON.stringify(body)));
        }

        Promise.all(requests)
            .then(() => {
                props.setMessages([...props.messages, ...messagesToStore]);
                setFiles([]);
                setText('');
                setIsUserScrolledUp(false);
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
                        console.error('Chat was deleted');
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
        setAnchorEl(null); // Closes the menu
    };

    const handleScroll = () => {
        setIsUserScrolledUp(true); // Update based on user's position
    };

    console.log(props.currentUser);

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
                    <List className="messages" onScroll={handleScroll}>
                        {props.messages?.map((message, index) =>
                            <ListItem
                                key={index}
                                className={`message-container ${message.user === props.currentUser?.uuid ? 'message-right' : 'message-left'}`}
                            >
                                {message.file != null ?
                                    <img
                                        className="image"
                                        src={message.file.name}
                                        alt={message.text}
                                        onError={(e) => console.log(e)}
                                    /> :
                                    <ListItemText
                                        className="message"
                                        primary={message.text}
                                        classes={{primary: 'moved-text'}}/>
                                }
                            </ListItem>
                        )}
                        <div ref={messagesEndRef}/>
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
                                        onError={(e) => console.log(e)}
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
