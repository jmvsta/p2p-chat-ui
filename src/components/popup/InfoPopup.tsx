import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import './Popup.css';
import {useStore} from '../../Store';

const InfoPopup: React.FC = () => {

    const {infoPopupOpen, setInfoPopupOpen, infoPopupTitle, infoPopupMessage, infoPopupButtonText} = useStore();

    const handleClose = () => {
        if (infoPopupButtonText === 'COPY') {
            navigator.clipboard.writeText(infoPopupMessage).then(() => {
                console.log('Message copied to clipboard');
            }).catch((err) => {
                console.error('Failed to copy message: ', err);
            });
        }
        setInfoPopupOpen(false);
    }

    return (
        <Dialog id='info-popup' open={infoPopupOpen} onClose={handleClose} className={'popup'}>
            <DialogTitle>{infoPopupTitle}</DialogTitle>
            <DialogContent className={'popup-content'}>
                <Typography>{infoPopupMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={handleClose}>
                    {infoPopupButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoPopup;
