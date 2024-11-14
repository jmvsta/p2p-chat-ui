import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField} from '@mui/material';
import './Popup.css';
import axios from "axios";

interface Props {
    open: boolean,
    handleClose: () => void,
    title: string,
    message: string,
    showPopup: (title: string, message: string) => void;
}

export const apiUrl = process.env.apiUrl;

const InputPopup: React.FC<Props> = (props) => {
    const [name, setName]: [string, (name: string) => void] = useState('');
    const [contact, setContact]: [string, (contact: string) => void] = useState('');

    const addContact = () => {
        axios.post(`${apiUrl}/api/users/add/`, JSON.stringify({
            name: name,
            contact: contact
        }))
            .then(() => {
                props.handleClose();
                props.showPopup('Success', 'Added new contact');
            })
            .catch(error => {
                console.error('Error adding contact ', error);
                props.handleClose();
                props.showPopup('Error', 'Error adding contact');
            });
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <Typography>{props.message}</Typography>
                <TextField
                    fullWidth
                    className="login-text-field"
                    variant="outlined"
                    label="user name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </DialogContent>
            <DialogContent>
                <Typography>{props.message}</Typography>
                <TextField
                    fullWidth
                    className="login-text-field"
                    variant="outlined"
                    label="user contact"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    className="popup-button"
                    variant="contained"
                    onClick={addContact}>
                    ADD
                </Button>
                <Button
                    className="popup-button"
                    variant="contained"
                    onClick={props.handleClose}>
                    CANCEL
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InputPopup;
