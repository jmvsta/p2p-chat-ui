import './App.css';
import React, {useEffect, useState} from 'react';
import Chats from './components/chats/Chats';
import ChatWindow from './components/chat-window/ChatWindow';
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography} from '@mui/material';
import Login from './components/login/Login';
import ServerPage from './components/server/ServerPage';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoPopup from './components/popup/InfoPopup';
import ContactPopup from './components/popup/ContactPopup';
import ChatEditPopup from './components/popup/ChatEditPopup';
import {useStore} from './Store';
import {useFetchData} from './hooks/useFetchData';
import {useServices} from "./services/ServiceProvider";
import ContactsPopup from "./components/contacts/ContactsPopup";

const App: React.FC = () => {

    const fetchData = useFetchData();

    const {
        setCurrentUser,
        setApiInited,
        apiInited,
        selectedServer,
        setSelectedServer,
        showInfoPopup,
        setContactsPopupOpen,
        showChatPopup
    } = useStore();

    const [anchorEl, setAnchorEl] = useState(null);
    const {userService} = useServices();

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleMenuClick = ({event, index}: { event: any, index: number }) => {
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                setContactsPopupOpen(true);
                setAnchorEl(null);
                break;
            case 1:
                showChatPopup('CREATE', null, 'Create chat');
                setAnchorEl(null);
                break;
            case 2:
                userService
                    .readContact()
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
            <ChatEditPopup/>
            <ContactsPopup/>
            {!apiInited &&
                <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
                    <div style={{width: '50%'}}>
                        <img className='logo-img' src='/logo.jpg' alt='logo image'/>
                        <Typography className='text-field' variant='h6' gutterBottom>
                            This secure chat will help you to communicate without sacrificing your safety. Connect
                            freely, use it anywhere, anonymously.
                        </Typography>
                    </div>
                    <Login style={{width: '50%'}}/>
                </div>
            }
            {apiInited && selectedServer === null &&
                <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
                    <div style={{width: '50%'}}>
                        <img className='logo-img' src='/logo_1.jpg' alt='logo'/>
                        <Typography className='text-field' variant='h6' gutterBottom>
                            This secure chat will help you to communicate without sacrificing your safety. Connect
                            freely, use it anywhere, anonymously.
                        </Typography>
                    </div>
                    <ServerPage style={{width: '50%'}}/>
                </div>
            }
            {apiInited && selectedServer !== null &&
                <div style={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
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
                                    handleMenuClick({event: event, index: 0})}>Contacts</MenuItem>
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
                    <div style={{display: 'flex', flexDirection: 'row', overflow: 'auto', height: '100%'}}>
                        <Chats style={{width: '20%'}}/>
                        <ChatWindow style={{flexDirection: 'column', display: 'flex', height: '100%', width: '80%'}}/>
                    </div>
                </div>
            }
        </div>
    );
}

export default App;
