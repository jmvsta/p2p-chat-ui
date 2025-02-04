import React from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText
} from '@mui/material';
import {useStore} from '../../Store';
import {ExtUser} from "../../types";
import {useServices} from "../../Providers";

const ContactsPopup: React.FC = () => {

    const contactsPopupOpen = useStore((state) => state.contactsPopupOpen);
    const setContactsPopupOpen = useStore((state) => state.setContactsPopupOpen);
    const openContactPopup = useStore((state) => state.openContactPopup);
    const setSelectedChat = useStore((state) => state.setSelectedChat);
    const chats = useStore((state) => state.chats);
    const contacts = useStore((state) => state.contacts);

    const {userService} = useServices();

    const handleOk = () => {
        setContactsPopupOpen(false);
        openContactPopup('CREATE', null);
    }

    const handleChooseItem = (id: number) => {
        setContactsPopupOpen(false);
        const chat = chats.find(chat => chat.id === `U${id}`);
        if (chat) {
            setSelectedChat(chat);
        }
    }

    const handleEditItem = (user: ExtUser) => {
        openContactPopup('UPDATE', user);
    }

    const handleRemoveItem = (user: ExtUser) => {
        userService
            .delete(user.id)
            .catch(console.error);
    }

    const handleClose = () => {
        setContactsPopupOpen(false);
    };

    return (
        <Dialog open={contactsPopupOpen} onClose={handleClose} className={'popup'} sx={{
            '& .MuiDialog-paper': {
                width: '40%',
                maxWidth: '300px',
            }
        }}>
            <DialogTitle>My contacts</DialogTitle>
            <DialogContent className={'popup-content'}>
                <List style={{overflowY: 'auto'}}>
                    {contacts?.map((contact: ExtUser) => (
                        <ListItemButton key={contact.id}
                                        onClick={() => handleChooseItem(contact.id)}
                                        sx={{
                                            padding: '10px',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0',
                                            },
                                        }}
                        >
                            <Avatar
                                src={''}
                                alt='avatar'
                                sx={{width: 40, height: 40, bgcolor: 'black'}}
                            />
                            <ListItemText
                                sx={{
                                    marginLeft: '1rem',
                                    '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        display: 'block',
                                    },
                                }}
                                primary={contact.name}
                            />
                            <button
                                data-testid={`edit-contact-${contact.id}`}
                                style={{
                                    background: 'none',
                                    color: 'green',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    lineHeight: 1,
                                    content: '✎'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditItem(contact);
                                }}
                            >✎
                            </button>
                            <button
                                data-testid={`remove-contact-${contact.id}`}
                                style={{
                                    background: 'none',
                                    color: 'red',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    lineHeight: 1
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(contact);
                                }}
                            >
                                &times;
                            </button>
                        </ListItemButton>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={handleOk}>
                    NEW
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

export default ContactsPopup;
