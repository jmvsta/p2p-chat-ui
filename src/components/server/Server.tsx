import './Server.css'
import {Paper, Autocomplete, TextField, Button, Typography} from '@mui/material';
import React, {useState} from 'react';
import axios from 'axios';
import useStore from '../../Store';

export const apiUrl = process.env.apiUrl;

const Server: React.FC = (props) => {
    const servers = useStore((state) => state.servers);
    const setSelectedServer = useStore((state) => state.setSelectedServer);
    const showInfoPopup = useStore((state) => state.showInfoPopup);
    const [data, setData] = useState('');

    const handleChooseServer = (event, server) => {
        servers.forEach(serverWrapper => {
            if (serverWrapper.addr === server) {
                localStorage.setItem('server', JSON.stringify(serverWrapper))
                setSelectedServer(server)
            }
        })
    };

    const handleAddServer = () => {
        axios.post(`${apiUrl}/api/servers/`, data)
            .then(() => {
                // FIXME: server should be posted and added in app setApiStat(true)
            })
            .catch(error => {
                console.error('Add server api request error: ', error);
                showInfoPopup('Error', 'Error adding server');
            })
    };

    return (
        <Paper className='server-wrapper'>
            <div>
                <Typography variant='h5' gutterBottom component='h5'>
                    Select server or add new by key
                </Typography>
                <Autocomplete
                    fullWidth
                    disablePortal
                    className='autocomplete'
                    onChange={handleChooseServer}
                    options={servers.map((server) => server.addr)}
                    renderInput={(params) => <TextField {...params} label='type server name'/>}
                />
                <TextField
                    fullWidth
                    className='login-text-field'
                    // variant='outlined'
                    label='add server key'
                    value={data}
                    onChange={e => setData(e.target.value)}
                />
                <Button
                    className='server-send-button'
                    variant='contained'
                    onClick={handleAddServer}>
                    GO
                </Button>
            </div>
        </Paper>
    );
}

export default Server;
