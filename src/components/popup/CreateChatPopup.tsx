import React, {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Autocomplete
} from '@mui/material';
import './Popup.css';
import axios from 'axios';
import {User} from '../../types';
import InfoPopup from './InfoPopup';

interface Props {
    open: boolean,
    handleClose: () => void,
    title: string,
    message: string,
    list: User[],
}

export const apiUrl = process.env.apiUrl;

const CreateChatPopup: React.FC<Props> = (props) => {
    const [name, setName]: [string, (name: string) => void] = useState('');
    const [userIds, setUserIds] = useState([]);
    const [infoPopupOpen, setInfoPopupOpen] = useState(false);
    const [infoPopupTitle, setInfoPopupTitle] = useState('');
    const [infoPopupMessage, setInfoPopupMessage] = useState('');

    const createChat = () => {
        axios.post(`${apiUrl}/api/chats/`, JSON.stringify({
            name: name,
            users: userIds
        }))
            .then(() => {
                console.info('Added chats')
                setUserIds([]);
                setName('');
                props.handleClose();
                showInfoPopup('Success', 'Added new chats');
            })
            .catch(error => {
                setUserIds([]);
                setName('');
                console.error('Error adding chats ', error);
                props.handleClose();
                showInfoPopup('Error', 'Error adding chats');
            });
    }

    const handleChooseItem = ({event, userIds}: { event: any, userIds: any }) => {
        setUserIds((prevUserIds) => [...prevUserIds, ...userIds]);
    }

    const handleSetChatName = (chatName: string) => {
        setName(chatName);
    }

    const handleInfoPopupClose = () => {
        props.handleClose();
        setInfoPopupOpen(false);
    };

    const showInfoPopup = (title: string, message: string) => {
        setInfoPopupTitle(title);
        setInfoPopupMessage(message);
        setInfoPopupOpen(true);
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <InfoPopup
                open={infoPopupOpen}
                handleClose={handleInfoPopupClose}
                title={infoPopupTitle}
                message={infoPopupMessage}
            />
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <Typography>{props.message}</Typography>
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
                    onChange={(event, value) => handleChooseItem({event: event, userIds: value.map(item => item.id)})}
                    options={props.list}
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
                    onClick={props.handleClose}>
                    CANCEL
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateChatPopup;
