import React, {useEffect, useState} from 'react';
import {AppBar, IconButton, Menu, MenuItem, Toolbar, Typography,} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {useStore} from '../../Store';
import Chats from "../chats/Chats";
import ChatWindow from "../chat-window/ChatWindow";
import {useServices} from "../../Providers";
import {useNavigate} from "react-router";
import ServersList from "../server/ServersList.tsx";
import ServerButton from "../server/ServerButton.tsx";

interface Props {
    style?: React.CSSProperties;
}

const HomePage: React.FC<Props> = (props) => {

    const openChatPopup = useStore((state) => state.openChatPopup);
    const setCurrentUser = useStore((state) => state.setCurrentUser);
    const apiInited = useStore((state) => state.apiInited);
    const setApiInited = useStore((state) => state.setApiInited);
    const openInfoPopup = useStore((state) => state.openInfoPopup);
    const openListEditPopup = useStore((state) => state.openListEditPopup);
    const openContactsPopup = useStore((state) => state.openContactsPopup);
    const {userService} = useServices();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!apiInited) {
            navigate('/login');
        }
    }, [apiInited]);

    const handleMenuClick = ({event, index}: { event: any, index: number }) => {
        setAnchorEl(event.currentTarget);
        switch (index) {
            case 0:
                openContactsPopup(true);
                setAnchorEl(null);
                break;
            case 1:
                openChatPopup('CREATE', null, 'Create chat');
                setAnchorEl(null);
                break;
            case 2:
                userService
                    .readContact()
                    .then((response) => openInfoPopup('Your contact', response.data, 'COPY', () => navigator.clipboard.writeText(response.data)))
                    .catch(error => console.error('Error fetching currentUser\'s friends: ', error));
                setAnchorEl(null);
                break;
            case 3:
                // navigate('/servers');
                openListEditPopup('Edit servers', null, <ServersList/>, [
                    <ServerButton id='add-server-popup-button' name={'ADD'} onClick={() => navigate('/')} style={{width: '100% !import', alignSelf: 'flex-center'}}/>,
                    <ServerButton id='close-popup-button' name={'CLOSE'} onClick={() => navigate('/')} style={{width: '100% !import', alignSelf: 'flex-center'}}/>]);
                setAnchorEl(null);
                break;
            case 4:
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
        <div className='app' style={{...props.style, display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'column', height: '100vh', width: '100%'}}>
                <AppBar position='static'>
                    <Toolbar sx={{backgroundColor: '#3B3B3B'}}>
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
                                handleMenuClick({event: event, index: 3})}>Servers</MenuItem>
                            <MenuItem onClick={(event) =>
                                handleMenuClick({event: event, index: 4})}>Logout</MenuItem>
                        </Menu>
                        <Typography variant='h6'>p2p-chat-ui</Typography>
                    </Toolbar>
                </AppBar>
                <div style={{display: 'flex', flexDirection: 'row', overflow: 'auto', height: '100%'}}>
                    <Chats style={{width: '20%'}}/>
                    <ChatWindow style={{width: '80%'}}/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
