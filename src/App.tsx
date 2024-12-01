import './App.css';
import React, {useEffect, useState} from 'react';
import Chats from './components/chats/Chats';
import ChatWindow from './components/chat-window/ChatWindow';
import {AppBar, Grid, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import Login from './components/login/Login';
import Server from './components/server/Server';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import InfoPopup from './components/popup/InfoPopup';
import ContactPopup from './components/popup/ContactPopup';
import ChatPopup from './components/popup/ChatPopup';
import useStore from './Store';

export const apiUrl = process.env.apiUrl;

const App: React.FC = () => {

    const setCurrentUser = useStore((state) => state.setCurrentUser);
    const setApiInited = useStore((state) => state.setApiInited);
    const apiInited = useStore((state) => state.apiInited);
    const selectedServer = useStore((state) => state.selectedServer);
    const setSelectedServer = useStore((state) => state.setSelectedServer);
    const fetchData = useStore((state) => state.fetchData);
    const [anchorEl, setAnchorEl] = useState(null);
    const showInfoPopup = useStore((state) => state.showInfoPopup);
    const showContactPopup = useStore((state) => state.showContactPopup);
    const showChatPopup = useStore((state) => state.showChatPopup);

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData()
        }, 5000)
        return () => clearInterval(interval)
    }, [fetchData]);

    const handleMenuClick = ({event, index}: { event: any, index: number }) => {
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                showContactPopup();
                setAnchorEl(null);
                break;
            case 1:
                showChatPopup('Create chat', 'Enter chat name');
                setAnchorEl(null);
                break;
            case 2:
                axios.get(`${apiUrl}/api/users/my-contact`)
                    .then((response) => showInfoPopup('Your contact', response.data, 'COPY'))
                    .catch(error => console.error('Error fetching currentUser\'s friends: ', error));
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
                setCurrentUser(null);
                setApiInited(false);
                setAnchorEl(null);
                break;
        }
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <div className='app'>
            <InfoPopup/>
            <ContactPopup/>
            <ChatPopup/>
            {!apiInited &&
                <Grid container spacing={0}>
                    <Grid className='grid-item' item xs={6}>
                        <img className='logo-img' src='/logo.jpg' alt='logo image'/>
                        <Typography className='text-field' variant='h6' gutterBottom>
                            This secure chat will help you to communicate without sacrificing your safety. Connect
                            freely, use it anywhere, anonymously.
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Login/>
                    </Grid>
                </Grid>
            }
            {apiInited && selectedServer === null &&
                <Grid container spacing={0}>
                    <Grid className='grid-item' item xs={6}>
                        <img className='logo-img' src='/logo_1.jpg' alt='logo'/>
                        <Typography className='text-field' variant='h6' gutterBottom>
                            This secure chat will help you to communicate without sacrificing your safety. Connect
                            freely, use it anywhere, anonymously.
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Server/>
                    </Grid>
                </Grid>
            }
            {apiInited && selectedServer !== null &&
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <AppBar position='static'>
                            <Toolbar className='toolbar'>
                                <IconButton edge='start' aria-label='menu'
                                            onClick={(event) => handleMenuClick({event: event, index: -1})}>
                                    <SettingsIcon/>
                                </IconButton>
                                <Menu
                                    id='simple_menu'
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
                                <Typography variant='h6'>p2p-chat-ui</Typography>
                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <Grid item xs={2}>
                        <Chats/>
                    </Grid>
                    <Grid item xs={10}>
                        <ChatWindow/>
                    </Grid>
                </Grid>
            }
        </div>
    );
}

export default App;
