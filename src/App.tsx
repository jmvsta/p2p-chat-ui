import './App.css';
import React from 'react';
import Chats from "./components/chats/Chats";
import {useEffect, useState} from "react";
import ChatWindow from "./components/chat-window/ChatWindow";
import {AppBar, Grid, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import Login from "./components/login/Login";
import Server from "./components/server/Server";
import SettingsIcon from '@mui/icons-material/Settings';
import axios from "axios";
import {Chat, User} from "./types";
import InfoPopup from "./components/popup/InfoPopup";
import InputPopup from "./components/popup/InputPopup";
import CreateChatPopup from "./components/popup/CreateChatPopup";

export const apiUrl = process.env.apiUrl;

const App: React.FC<any> = () => {
    const [user, setUser]: [User, (user: User) => void] = useState(null);
    const [apiStat, setApiStat]: [boolean, (status: boolean) => void] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat]: [Chat, (chat: Chat) => void] = useState(null);
    const [selectedServer, setSelectedServer]: [Server, (server: Server) => void] = useState(JSON.parse(localStorage.getItem('server')));
    const [servers, setServers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const [infoPopupOpen, setInfoPopupOpen] = useState(false);
    const [infoPopupTitle, setInfoPopupTitle] = useState('');
    const [infoPopupMessage, setInfoPopupMessage] = useState('');

    const [inputPopupOpen, setInputPopupOpen] = useState(false);
    const [inputPopupTitle, setInputPopupTitle] = useState('');
    const [inputPopupMessage, setInputPopupMessage] = useState('');

    const [inputSelectPopupOpen, setInputSelectPopupOpen] = useState(false);
    const [inputSelectPopupTitle, setInputSelectPopupTitle] = useState('');
    const [inputSelectPopupList, setInputSelectPopupList]: [User[], (users: User[]) => void] = useState([]);
    const [inputSelectPopupMessage, setInputSelectPopupMessage] = useState('');

    const handleInfoPopupClose = () => {
        setInfoPopupOpen(false);
    };

    const handleInputPopupClose = () => {
        setInputPopupOpen(false);
    };

    const handleInputSelectPopupClose = () => {
        setInputSelectPopupOpen(false);
    };

    const showInfoPopup = (title: string, message: string) => {
        setInfoPopupTitle(title);
        setInfoPopupMessage(message);
        setInfoPopupOpen(true);
    };

    const showInputPopup = (title: string, message: string) => {
        setInputPopupTitle(title);
        setInputPopupMessage(message);
        setInputPopupOpen(true);
    };

    const showInputSelectPopup = (title: string, message: string) => {
        setInputSelectPopupTitle(title);
        setInputSelectPopupMessage(message);
        setInputSelectPopupOpen(true);
    };

    useEffect(() => {
        axios.get(`${apiUrl}/api/settings/status/`)
            .then((response) => setApiStat(response.data.inited))
            .catch(error => console.error('Init status request error:', error));

        axios.get(`${apiUrl}/api/settings/me/`)
            .then((response) => setUser(response.data))
            .catch(error => console.error('User settings request error:', error));

        axios.get(`${apiUrl}/api/chats/list/?offset=-1&limit=10&filter_banned=false`)
            .then((response) =>
                setChats(response.data.chats.sort((a, b) => a.last_active.localeCompare(b.last_active))))
            .catch(error => console.error('Chats request error:', error));

        axios.get(`${apiUrl}/api/servers/list`)
            .then((response) => setServers(response.data.servers))
            .catch(error => console.error('Servers request error:', error));

        return () => {
        };
    }, []);

    const handleMenuClick = ({event, index}: { event: any, index: number }) => {
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                showInputPopup('Add new contact', 'Enter contact key');
                setAnchorEl(null);
                break;
            case 1:
                axios.get(`${apiUrl}/api/users/list`)
                    .then((response) => setInputSelectPopupList(response.data.users))
                    .catch(error => console.error('Error fetching user\'s friends: ', error));
                showInputSelectPopup('Add new chats', 'Enter chats name');
                setAnchorEl(null);
                break;
            case 2:
                axios.get(`${apiUrl}/api/users/my-contact`)
                    .then((response) => showInfoPopup('Your contact', response.data))
                    .catch(error => console.error('Error fetching user\'s friends: ', error));
                setAnchorEl(null);
                break;
            case 3:
                localStorage.removeItem('server');
                setSelectedServer(null);
                setAnchorEl(null);
                break;
            case 4:
                localStorage.removeItem('server');
                setSelectedServer(null);
                setUser(null);
                setApiStat(false);
                setAnchorEl(null);
                break;
        }
    }

    const deleteChat = (chat: Chat) => {
        setChats(prevItems => prevItems.filter(item => item !== chat))
    }

    const handleCloseMenu = () => {
        setAnchorEl(null); // Closes the menu
    };

    return (
        <div className="app">
            <InfoPopup
                open={infoPopupOpen}
                handleClose={handleInfoPopupClose}
                title={infoPopupTitle}
                message={infoPopupMessage}
            />
            <InputPopup
                open={inputPopupOpen}
                handleClose={handleInputPopupClose}
                title={inputPopupTitle}
                message={inputPopupMessage}
                showPopup={showInfoPopup}
            />
            <CreateChatPopup
                open={inputSelectPopupOpen}
                handleClose={handleInputSelectPopupClose}
                title={inputSelectPopupTitle}
                message={inputSelectPopupMessage}
                list={inputSelectPopupList}
            />
            {!apiStat &&
                <Grid container spacing={0}>
                    <Grid className="grid-item" item xs={6}>
                        <img className="logo-img" src="/logo.jpg" alt="logo image"/>
                        <Typography className="text-field" variant="h6" gutterBottom>
                            This secure chat will help you to communicate without sacrificing your safety. Connect
                            freely, use it anywhere, anonymously.
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Login setApiStat={setApiStat} setUser={setUser} showPopup={showInfoPopup}/>
                    </Grid>
                </Grid>
            }
            {apiStat && selectedServer === null &&
                <Grid container spacing={0}>
                    <Grid className="grid-item" item xs={6}>
                        <img className="logo-img" src="/logo_1.jpg" alt="logo"/>
                        <Typography className="text-field" variant="h6" gutterBottom>
                            This secure chat will help you to communicate without sacrificing your safety. Connect
                            freely, use it anywhere, anonymously.
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Server servers={servers} setSelectedServer={setSelectedServer} setApiStat={setApiStat}
                                showPopup={showInfoPopup}/>
                    </Grid>
                </Grid>
            }
            {apiStat && selectedServer !== null &&
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <AppBar position="static">
                            <Toolbar className="toolbar">
                                <IconButton edge="start" aria-label="menu"
                                            onClick={(event) => handleMenuClick({event: event, index: -1})}>
                                    <SettingsIcon/>
                                </IconButton>
                                <Menu
                                    id="simple_menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseMenu}
                                >
                                    <MenuItem onClick={(event) =>
                                        handleMenuClick({event: event, index: 0})}>New Contact</MenuItem>
                                    <MenuItem onClick={(event) =>
                                        handleMenuClick({event: event, index: 1})}>New Chat</MenuItem>
                                    <MenuItem onClick={(event) =>
                                        handleMenuClick({event: event, index: 2})}>My key</MenuItem>
                                    <MenuItem onClick={(event) =>
                                        handleMenuClick({event: event, index: 3})}>Server</MenuItem>
                                    <MenuItem onClick={(event) =>
                                        handleMenuClick({event: event, index: 4})}>Logout</MenuItem>
                                </Menu>
                                <Typography variant="h6">p2p-chat-ui</Typography>
                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <Grid item xs={2}>
                        <Chats chats={chats} setChats={setChats} setSelectedChat={setSelectedChat}/>
                    </Grid>
                    <Grid item xs={10}>
                        <ChatWindow currentUser={user}
                                    selectedChat={selectedChat}
                                    setSelectedChat={setSelectedChat} deleteChat={deleteChat}/>
                    </Grid>
                </Grid>
            }
        </div>
    );
}

export default App;
