import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField} from '@mui/material';
import './Popup.css';

interface Props {
    open: boolean,
    handleClose: () => void,
    title: string,
    message: string
}

const InfoPopup: React.FC<Props> = (props) => {
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <Typography>{props.message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    className="popup-button"
                    variant="contained"
                    onClick={props.handleClose}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoPopup;
