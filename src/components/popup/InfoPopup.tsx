import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';
import './Popup.css';
import useStore from "../../Store";

const InfoPopup: React.FC = () => {
    const open = useStore((state) => state.infoPopupOpen);
    const setOpen = useStore((state) => state.setInfoPopupOpen);
    const title = useStore((state) => state.infoPopupTitle);
    const message = useStore((state) => state.infoPopupMessage);

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    className='popup-button'
                    variant='contained'
                    onClick={handleClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoPopup;
