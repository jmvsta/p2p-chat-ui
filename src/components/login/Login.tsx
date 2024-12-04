import './Login.css'
import {Box, Button, IconButton, Paper, TextField, Typography} from '@mui/material';
import React, {RefObject, useState} from 'react';
import {useStore} from '../../Store';
import AddLinkIcon from '@mui/icons-material/AddLink';
import UserService from "../../services/UserService";
import ApiSettingsService from "../../services/ApiSettingsService";

interface Props {
    style?: React.CSSProperties;
}

const Login: React.FC<Props> = (props) => {

    const [login, setLogin] = useState('');
    const [photo, setPhoto] = useState<Blob>(null);
    const [password, setPassword]: [string, (password: string) => void] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef: RefObject<any> = React.createRef();
    const setApiInited = useStore((state) => state.setApiInited);
    const showInfoPopup = useStore((state) => state.showInfoPopup);
    const userService = new UserService();
    const apiService = new ApiSettingsService();

    const handleLogin = () => {
        if (login === '' || password === '' || photo === null) {
            showInfoPopup('Error', 'All fields are required');
            return;
        }

        Promise.all([
            apiService.create(password),
            userService.update(login, photo)
        ])
            .then(() => setApiInited(true))
            .catch((error: Error) => {
                console.error('Login: Api init get error: ', error);
                showInfoPopup('Error', 'Login error');
            })
            .finally(() => {
                setPhoto(null);
                setLogin('');
                setPassword('');
                setFileName('');
            })
    };

    const handleIconButtonClick = () => fileInputRef.current.click();

    const handleAddFile = (event) => {
        const files = event.target.files;
        if (!files) return;
        setPhoto(files[0]);
        setFileName(files[0]?.name);
    }

    return (
        <Paper className='login-wrapper' style={{...props?.style}}>
            <Typography variant='h5' gutterBottom>
                Complete registration to sign in
            </Typography>
            <TextField
                fullWidth
                className='login-text-field'
                variant='outlined'
                label='Enter login'
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <TextField
                fullWidth
                className='login-text-field'
                variant='outlined'
                label='Enter password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Box
                className='login-text-field'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                width='60%'
                mb={1}
            >
                <TextField
                    fullWidth
                    variant='outlined'
                    value={fileName || 'No file selected'}
                    disabled
                    label='Uploaded File'
                />
                <IconButton edge='start' onClick={handleIconButtonClick}>
                    <AddLinkIcon/>
                </IconButton>
                <input
                    id='upload-image'
                    hidden
                    accept='*/*'
                    type='file'
                    ref={fileInputRef}
                    onChange={handleAddFile}
                />
            </Box>
            <Button
                className='login-send-button'
                variant='contained'
                onClick={handleLogin}
            >
                GO
            </Button>
        </Paper>
    )
}
export default Login;
