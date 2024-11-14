import './Login.css'
import {Button, Paper, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import axios from "axios";
import {sha3_512} from "js-sha3";
import {User} from "../../types";

interface Props {
    setApiStat: (status: boolean) => void;
    setUser: (user: User) => void;
    showPopup: (title: string, message: string) => void;
}

export const apiUrl = process.env.apiUrl;

const Login: React.FC<Props> = (props) => {
    const [login, setLogin] = useState('');
    const [password, setPassword]: [string, (password: string) => void] = useState('');

    const handleLogin = () => {
        if (login == '' || password == '') {
            //     TODO
            return;
        }
        const requests = [];
        requests.push(axios.post(`${apiUrl}/api/settings/init/?pwd=${sha3_512(password)}}`));
        const user: User = {
            "name": login,
            "pic": ""
        }
        requests.push(axios.post(`${apiUrl}/api/settings/me/`, JSON.stringify(user)));

        Promise.all(requests)
            .then(() => {
                props.setUser(user);
                props.setApiStat(true);
            })
            .catch(error => {
                console.error('Login: Api init get error: ', error)
                props.showPopup('Error', 'Login error');
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
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                />
                <TextField
                    fullWidth
                    className="login-text-field"
                    variant="outlined"
                    label="secret key number"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
