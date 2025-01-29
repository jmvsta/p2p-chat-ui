import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import './Popup.css';
import {useStore} from '../../Store';
import {useServices} from '../../services/ServiceProvider';
import {ChatDetails, ExtUser} from "../../types";

const ChatEditPopup: React.FC = () => {
    const {
        chatPopupAction,
        chatPopupChat,
        chatPopupOpen,
        closeChatPopup,
        chatPopupTitle,
        contacts
    } = useStore();
    const {chatService} = useServices();
    const [chatName, setChatName] = useState('');
    const [participants, setParticipants] = useState<ExtUser[]>([]);
    const [userIds, setUserIds] = useState<number[]>([]);
    const [isNameSet, setIsNameSet] = useState<boolean>(false);

    useEffect(() => {
        if (chatPopupOpen && chatPopupChat) {
            if (!isNameSet) {
                setChatName(chatPopupChat.name);
                setIsNameSet(true);
            }

            chatService.details(chatPopupChat.id)
                .then((response) => {
                    const chatDetails: ChatDetails = response.data;
                    if (chatDetails) {
                        setParticipants(contacts.filter(contact =>
                            !chatDetails.participants.includes(contact.id) && !userIds.includes(contact.id)));
                    }
                })
                .catch(console.error)
        } else if (chatPopupOpen && chatPopupAction === 'CREATE') {
            setParticipants(contacts.filter(contact => !userIds.includes(contact.id)));
        }
    }, [chatPopupOpen, chatPopupChat, contacts]);

    const handleOk = () => {
        const requests = [];
        switch (chatPopupAction) {
            case 'CREATE':
                requests.push(chatService.create(chatName, userIds));
                break;
            case 'UPDATE':
                if (chatPopupChat === null) break;
                if (chatPopupChat.name !== chatName) {
                    requests.push(chatService.rename(chatPopupChat.id, chatName));
                }
                userIds.forEach((userId) => {
                    requests.push(chatService.addParticipant(chatPopupChat.id, userId));
                });
                break;
        }
        Promise.all([requests])
            .catch((error) => console.error(`Chat ${chatPopupAction} error: `, error))
            .finally(() => {
                setUserIds([]);
                setChatName(chatPopupChat?.name ?? '');
                setParticipants([])
                closeChatPopup();
            });
    }

    const handleChooseItem = (userIds: number[]) => {
        setUserIds(userIds);
    }

    const handleSetChatName = (chatName: string) => {
        setChatName(chatName);
    }

    const handleClose = () => {
        setUserIds([]);
        setChatName('');
        setParticipants([])
        closeChatPopup();
        setIsNameSet(false);
    };

    return (
        <Dialog open={chatPopupOpen} onClose={handleClose} className={'popup'}>
            <DialogTitle>{chatPopupTitle}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    sx={{marginTop: '1rem'}}
                    variant='outlined'
                    label='Chat name'
                    value={chatName}
                    onChange={e => handleSetChatName(e.target.value)}
                />
                {(chatPopupChat === null || chatPopupChat.id[0] === 'C') &&
                    <Autocomplete
                        fullWidth
                        sx={{marginTop: '1rem'}}
                        multiple
                        disablePortal={false}
                        className='autocomplete'
                        onChange={(_, value) => handleChooseItem(value.map(item => item.id))}
                        options={participants}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label='Start typing participant...'/>}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={handleOk}>
                    {chatPopupAction}
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

export default ChatEditPopup;
