import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, TextField} from '@mui/material';
import '../popup/Popup.css';
import {useStore} from '../../Store.ts';
import {useServices} from '../../services/ServiceProvider';

const ContactPopup: React.FC = () => {

    const [name, setName]: [string, (name: string) => void] = useState('');
    const [contact, setContact]: [string, (contact: string) => void] = useState('');
    const {contactPopupOpen, closeContactPopup, openInfoPopup, contactPopupUser, contactPopupAction} = useStore();
    const [isNameSet, setIsNameSet] = useState<boolean>(false);
    const [popupHeader, setPopupHeader] = useState<string>('');
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const {userService} = useServices();

    useEffect(() => {
        if (contactPopupOpen && contactPopupUser && contactPopupAction === 'UPDATE') {
            setPopupHeader('Update contact');
            if (!isNameSet) {
                setIsBanned(contactPopupUser.status === 'banned');
                setName(contactPopupUser.name);
                setIsNameSet(true);
            }
        } else if (contactPopupOpen && contactPopupUser && contactPopupAction === 'CREATE') {
            setPopupHeader('Add new contact');
        }
    }, [contactPopupOpen, contactPopupUser]);

    const addContact = () => {
        userService
            .create(name, contact)
            .then(() => openInfoPopup('Success', `We\'ve sent invitation to ${name}. Once they accept it, the chat will be created`))
            .catch((error) => console.error('Error adding contact ', error))
            .finally(handleClose)
    }

    const updateContact = () => {
        if (contactPopupUser) {
            const newStatus = isBanned ? 'banned' : 'confirmed';
            userService
                .update(contactPopupUser.id, name, newStatus)
                .then(() => {})
                .catch((error) => console.error('Error adding contact ', error))
                .finally(handleClose)
        }
    }

    const handleClose = () => {
        closeContactPopup()
        setName('');
        setContact('');
        setContact('');
        setIsNameSet(false);
        setIsNameSet(false);
    };

    return (
        <Dialog open={contactPopupOpen} onClose={() => handleClose()} className={'popup'}>
            <DialogTitle>{popupHeader}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    sx={{marginTop: '1rem'}}
                    variant='outlined'
                    label='User name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {contactPopupUser ?
                    <Switch checked={isBanned} onChange={() => setIsBanned(!isBanned)} color="primary" /> :
                    <TextField
                        fullWidth
                        sx={{marginTop: '1rem'}}
                        variant='outlined'
                        label='User contact'
                        value={contact}
                        onChange={e => setContact(e.target.value)}
                    />
                }
            </DialogContent>
            <DialogActions>
                {contactPopupUser ?
                    <Button
                        className='popup-button'
                        variant='contained'
                        onClick={updateContact}>
                        UPDATE
                    </Button> :
                    <Button
                        className='popup-button'
                        variant='contained'
                        onClick={addContact}>
                        ADD
                    </Button>
                }
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={() => handleClose()}>
                    CANCEL
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactPopup;
