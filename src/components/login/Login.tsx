import './Login.css'
import {Button, Paper, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import axios from 'axios';
import {sha3_512} from 'js-sha3';
import useStore from '../../Store';

export const apiUrl = process.env.apiUrl;

const Login: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword]: [string, (password: string) => void] = useState('');
    const setCurrentUser = useStore((state) => state.setCurrentUser);
    const setApiInited = useStore((state) => state.setApiInited);
    const showInfoPopup = useStore((state) => state.showInfoPopup);

    const handleLogin = async () => {
        if (login == '' || password == '') {
            //     TODO: add red indicators to inputs, disable button
            return;
        }
        const user = {
            'name': login,
            'pic': ''
        }
        try {
            await Promise.all([
                axios.post(`${apiUrl}/api/settings/init/?pwd=${sha3_512(password)}}`),
                axios.post(`${apiUrl}/api/settings/me/`, JSON.stringify(user))
            ]);
            setApiInited(true);
            const response = await axios.get(`${apiUrl}/api/settings/me/`);
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Login: Api init get error: ', error);
            showInfoPopup('Error', 'Login error');
        }
    };

    return (
        <Paper className='login-wrapper'>
            <div>
                <Typography variant='h5' gutterBottom>
                    Log in
                </Typography>
                <TextField
                    fullWidth
                    className='login-text-field'
                    variant='outlined'
                    label='user id'
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                />
                <TextField
                    fullWidth
                    className='login-text-field'
                    variant='outlined'
                    label='secret key number'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button
                    className='login-send-button'
                    variant='contained'
                    onClick={handleLogin}>
                    GO
                </Button>
            </div>
        </Paper>
    )
}
export default Login;
