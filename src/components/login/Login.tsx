import './Login.css'
import {Box, Button, IconButton, Paper, TextField, Typography} from '@mui/material';
import React, {RefObject, useState} from 'react';
import axios from 'axios';
import {sha3_512} from 'js-sha3';
import useStore from '../../Store';
import AddLinkIcon from '@mui/icons-material/AddLink';

export const apiUrl = process.env.apiUrl;

const Login: React.FC = () => {

    const [login, setLogin] = useState('');
    const [blob, setBlob] = useState<Blob>(null);
    const [password, setPassword]: [string, (password: string) => void] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef: RefObject<any> = React.createRef();
    const setApiInited = useStore((state) => state.setApiInited);
    const showInfoPopup = useStore((state) => state.showInfoPopup);

    const handleLogin = async () => {
        if (login === '' || password === '' || blob === null) {
            showInfoPopup('Error', 'All fields are required');
            return;
        }

        const formData = new FormData();
        formData.append('name', login);
        formData.append('pic', blob)

        try {
            await Promise.all([
                axios.post(`${apiUrl}/api/settings/init/?pwd=${sha3_512(password)}}`),
                axios.post(`${apiUrl}/api/settings/me/`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'},
                })
            ]);
            setApiInited(true);
        } catch (error) {
            console.error('Login: Api init get error: ', error);
            showInfoPopup('Error', 'Login error');
            setBlob(null);
        }
        setBlob(null);
        setLogin('');
        setPassword('');
        setFileName('');
    };

    const handleIconButtonClick = () => fileInputRef.current.click();

    const handleAddFile = (event) => {
        const files = event.target.files;
        if (!files) return;
        setBlob(files[0]);
        setFileName(files[0]?.name);
    }

    return (
        <Paper className='login-wrapper'>
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
