import React from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, List,
    ListItemButton,
    ListItemText
} from '@mui/material';
import {useStore} from '../../Store';
import {ExtUser} from "../../types";
import {useServices} from "../../services/ServiceProvider.tsx";

const ContactsPopup: React.FC = () => {
    const {
        contactsPopupOpen,
        setContactsPopupOpen,
        setContactPopupOpen,
        setSelectedChat,
        chats,
        contacts
    } = useStore();

    const {userService} = useServices();

    const handleOk = () => {
        setContactsPopupOpen(false);
        setContactPopupOpen(true);
    }

    const handleChooseItem = (id: number) => {
        setContactsPopupOpen(false);
        const chat = chats.find(chat => chat.id === `U${id}`);
        if (chat) {
            setSelectedChat(chat);
        }
    }

    const handleRemoveItem = (user: ExtUser) => {
        userService
            .delete(user.id)
            .then(() => {})
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
                                sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: 'black',
                                }}
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
