import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField} from '@mui/material';
import './Popup.css';
import axios from 'axios';

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void,
}

export const apiUrl = process.env.apiUrl;

const InputContactPopup: React.FC<Props> = (props) => {
    const [name, setName]: [string, (name: string) => void] = useState('');
    const [contact, setContact]: [string, (contact: string) => void] = useState('');

    const addContact = () => {
        axios.post(`${apiUrl}/api/users/add/`, JSON.stringify({
            name: name,
            contact: contact
        }))
            .then(() => {
                props.setOpen(false);
                // props.showPopup('Success', 'Added new contact');
            })
            .catch(error => {
                console.error('Error adding contact ', error);
                props.setOpen(false);
                // props.showPopup('Error', 'Error adding contact');
            });
    }

    const handleClose = () => {
        props.setOpen(false);
    }

    return (
        <Dialog open={props.open} onClose={handleClose}>
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
