import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import './Popup.css';
import {useStore} from '../../Store';

const InfoPopup: React.FC = () => {

    const infoPopupAction = useStore((state) => state.infoPopupAction);
    const infoPopupOpen = useStore((state) => state.infoPopupOpen);
    const closeInfoPopup = useStore((state) => state.closeInfoPopup);
    const infoPopupTitle = useStore((state) => state.infoPopupTitle);
    const infoPopupMessage = useStore((state) => state.infoPopupMessage);
    const infoPopupButtonText = useStore((state) => state.infoPopupButtonText);

    const handleClose = () => {
        closeInfoPopup();
        infoPopupAction();
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
