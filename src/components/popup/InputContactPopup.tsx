import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import './Popup.css';
import axios from 'axios';
import useStore from '../../Store';

export const apiUrl = process.env.apiUrl;

const InputContactPopup: React.FC = () => {
    const [name, setName]: [string, (name: string) => void] = useState('');
    const [contact, setContact]: [string, (contact: string) => void] = useState('');
    const open = useStore((state) => state.contactPopupOpen);
    const setOpen = useStore((state) => state.setContactPopupOpen);

    const addContact = () => {
        axios.post(`${apiUrl}/api/users/add/`, JSON.stringify({
            name: name,
            contact: contact
        }))
            .then(() => {
                setOpen(false);
            })
            .catch(error => {
                console.error('Error adding contact ', error);
                setOpen(false);
            });
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add new contact</DialogTitle>
            <DialogContent>
                <Typography>Enter user name</Typography>
                <TextField
                    fullWidth
                    className='contact-input'
                    variant='outlined'
                    label='user name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </DialogContent>
            <DialogContent>
                <Typography>Enter contact key</Typography>
                <TextField
                    fullWidth
                    className='contact-input'
                    variant='outlined'
                    label='user contact'
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={addContact}>
                    ADD
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

export default InputContactPopup;
