import React, {useState} from 'react';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';
import './Popup.css';
import axios from 'axios';
import useStore from "../../Store";

export const apiUrl = process.env.apiUrl;

const CreateChatPopup: React.FC = () => {
    const [name, setName]: [string, (name: string) => void] = useState('');
    const [userIds, setUserIds] = useState([]);
    const open = useStore((state) => state.chatPopupOpen);
    const setOpen = useStore((state) => state.setChatPopupOpen);
    const title = useStore((state) => state.chatPopupTitle);
    const message = useStore((state) => state.chatPopupMessage);
    const users = useStore((state) => state.contacts);

    const createChat = () => {
        axios.post(`${apiUrl}/api/chats/`, JSON.stringify({
            name: name,
            users: userIds
        }))
            .then(() => {
                setUserIds([]);
                setName('');
                setOpen(false);
            })
            .catch(error => {
                setUserIds([]);
                setName('');
                console.error('Error adding chats ', error);
                setOpen(false);
            });
    }

    const handleChooseItem = (userIds: string[]) => {
        setUserIds((prevUserIds) => [...prevUserIds, ...userIds]);
    }

    const handleSetChatName = (chatName: string) => {
        setName(chatName);
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
                <TextField
                    fullWidth
                    className='login-text-field'
                    variant='outlined'
                    label='chat name'
                    name={name}
                    onChange={e => handleSetChatName(e.target.value)}
                />
                <Autocomplete
                    fullWidth
                    multiple
                    disablePortal
                    className='autocomplete'
                    onChange={(_, value) => handleChooseItem(value.map(item => item.ext_id))}
                    options={users}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label='start typing...'/>}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={createChat}>
                    CREATE
                </Button>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={handleClose}>
                    CANCEL
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateChatPopup;
