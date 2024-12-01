import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import './Popup.css';
import useStore from '../../Store';

const InfoPopup: React.FC = () => {
    const open = useStore((state) => state.infoPopupOpen);
    const setOpen = useStore((state) => state.setInfoPopupOpen);
    const title = useStore((state) => state.infoPopupTitle);
    const message = useStore((state) => state.infoPopupMessage);
    const buttonText = useStore((state) => state.infoPopupButtonText);

    const handleClose = () => {
        if (buttonText === 'COPY') {
            navigator.clipboard.writeText(message).then(() => {
                console.log('Message copied to clipboard');
            }).catch((err) => {
                console.error('Failed to copy message: ', err);
            });
        }
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent className={'popup-content'}>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={handleClose}>
                    {buttonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoPopup;
