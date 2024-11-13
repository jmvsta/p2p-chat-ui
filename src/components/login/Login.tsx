import './Login.css'
import {Button, Paper, TextField, Typography} from "@mui/material";
import {apiUrl} from "../../config";
import React, {useState} from "react";
import axios from "axios";

interface Props {
    onLogin: (status: string) => void;
    showPopup: (title: string, message: string) => void;
}

const Login: React.FC<Props> = (props) => {
    const [userId, setUserId] = useState('');
    const [secretKey, setSecretKey] = useState('');

    const handleLogin = () => {
        const initApiBody = {
            priv_key: secretKey,
            name: userId,
            description: "",
        };
        axios.post(`${apiUrl}/api/init/`, JSON.stringify(initApiBody))
            .then(() => props.onLogin("INITED"))
            .catch(error => {
                console.error('Login: Api init get error: ', error)
                props.showPopup('Error', 'Error choosing server');
            });
    };

    return (
        <Paper className="login-wrapper">
            <div>
                <Typography variant="h5" gutterBottom>
                    Log in
                </Typography>
                <TextField
                    fullWidth
                    className="login-text-field"
                    variant="outlined"
                    label="user id"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                />
                <TextField
                    fullWidth
                    className="login-text-field"
                    variant="outlined"
                    label="secret key number"
                    value={secretKey}
                    onChange={e => setSecretKey(e.target.value)}
                />
                <Button
                    className="login-send-button"
                    variant="contained"
                    onClick={handleLogin}>
                    GO
                </Button>
            </div>
        </Paper>
    )
}
export default Login;
