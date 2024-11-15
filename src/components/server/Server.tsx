import './Server.css'
import {Paper, Autocomplete, TextField, Button, Typography} from "@mui/material";
import React, {useState} from "react";
import {Server} from "../../types";
import axios from "axios";

interface Props {
    servers: Server[];
    setSelectedServer: (server: Server) => void;
    setApiStat: (status: boolean) => void;
    showPopup: (title: string, message: string) => void;
}

export const apiUrl = process.env.apiUrl;

const Server: React.FC<Props> = (props) => {
    const [data, setData] = useState('');

    const handleChooseServer = (event, server) => {
        props.servers?.forEach(serverWrapper => {
            if (serverWrapper.addr === server) {
                localStorage.setItem('server', JSON.stringify(serverWrapper))
                props.setSelectedServer(server)
            }
        })
    };

    const handleAddServer = () => {
        axios.post(`${apiUrl}/api/servers/add`, data)
            .then(() => props.setApiStat(true))
            .catch(error => {
                console.error('Add server api request error:', error);
                props.showPopup('Error', 'Error choosing server');
            })
    };

    return (
        <Paper className="server-wrapper">
            <div>
                <Typography variant="h5" gutterBottom component="h5">
                    Select server or add new by key
                </Typography>
                <Autocomplete
                    fullWidth
                    disablePortal
                    className="autocomplete"
                    onChange={handleChooseServer}
                    options={props.servers?.map((server) => server.addr)}
                    renderInput={(params) => <TextField {...params} label="type server name"/>}
                />
                <TextField
                    fullWidth
                    className="login-text-field"
                    // variant="outlined"
                    label="add server key"
                    value={data}
                    onChange={e => setData(e.target.value)}
                />
                <Button
                    className="server-send-button"
                    variant="contained"
                    onClick={handleAddServer}>
                    GO
                </Button>
            </div>
        </Paper>
    );
}

export default Server;
