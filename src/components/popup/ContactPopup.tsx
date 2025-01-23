import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import './Popup.css';
import {useStore} from '../../Store';
import {useServices} from '../../services/ServiceProvider';

const ContactPopup: React.FC = () => {

    const [name, setName]: [string, (name: string) => void] = useState('');
    const [contact, setContact]: [string, (contact: string) => void] = useState('');
    const {contactPopupOpen, setContactPopupOpen, showInfoPopup} = useStore();
    const {userService} = useServices();

    const addContact = () => {
        userService
            .create(name, contact)
            .then(() => showInfoPopup('Success', `We\'ve sent invitation to ${name}. Once they accept it, the chat will be created`))
            .catch((error) => console.error('Error adding contact ', error))
            .finally(() => {
                setContactPopupOpen(false);
                setName('');
                setContact('');
            })
    }

    return (
        <Dialog open={contactPopupOpen} onClose={() => setContactPopupOpen(false)} className={'popup'}>
            <DialogTitle>Add new contact</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    sx={{marginTop: '1rem'}}
                    variant='outlined'
                    label='User name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <TextField
                    fullWidth
                    sx={{marginTop: '1rem'}}
                    variant='outlined'
                    label='User contact'
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
                    onClick={() => setContactPopupOpen(false)}>
                    CANCEL
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactPopup;
