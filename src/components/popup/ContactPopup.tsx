import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import './Popup.css';
import {useStore} from '../../Store';
import {useServices} from '../../services/ServiceProvider.tsx';

const ContactPopup: React.FC = () => {

    const [name, setName]: [string, (name: string) => void] = useState('');
    const [contact, setContact]: [string, (contact: string) => void] = useState('');
    const open = useStore((state) => state.contactPopupOpen);
    const setOpen = useStore((state) => state.setContactPopupOpen);
    const showInfoPopup = useStore((state) => state.showInfoPopup);
    const {userService} = useServices();

    const addContact = () => {
        userService
            .create(name, contact)
            .then(() => showInfoPopup('Success', `We\'ve sent invitation to ${name}. Once they accept it, the chat will be created`))
            .catch((error) => console.error('Error adding contact ', error))
            .finally(() => {
                setOpen(false);
                setName('');
                setContact('');
            })
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
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
                    onClick={() => setOpen(false)}>
                    CANCEL
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactPopup;
