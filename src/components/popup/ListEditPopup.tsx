import React, {useEffect} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import './Popup.css';
import {useStore} from '../../Store';

const ListEditPopup: React.FC = () => {

    const isOpen = useStore((state) => state.listEditPopupOpen);
    const close = useStore((state) => state.closeListEditPopup);
    const title = useStore((state) => state.listEditPopupTitle);
    const updateFunction = useStore((state) => state.listEditPopupUpdateFunction);
    const content = useStore((state) => state.listEditPopupContent);
    const buttons = useStore((state) => state.listEditPopupButtons);

    useEffect(() => {
        if (updateFunction) {
            updateFunction();
        }
    }, [updateFunction]);

    const handleClose = () => {
        close();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className={'popup'}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>{buttons}</DialogActions>
        </Dialog>
    );
};

export default ListEditPopup;
