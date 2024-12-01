import './Server.css'
import {Paper, Autocomplete, TextField, Button, Typography} from '@mui/material';
import React, {useState} from 'react';
import axios from 'axios';
import useStore from '../../Store';

export const apiUrl = process.env.apiUrl;

const Server: React.FC = () => {
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
                showInfoPopup('Success', 'Added server successfully');
                setData('');
            })
            .catch(error => {
                console.error('Add server api request error: ', error);
                showInfoPopup('Error', 'Error adding server');
                setData('');
            })
    };

    return (
        <Paper className='server-wrapper'>
            <div>
                <Typography variant='h5' gutterBottom component='h5'>
                    Select server from list
                </Typography>
                <Autocomplete
                    fullWidth
                    disablePortal
                    className='autocomplete'
                    onChange={handleChooseServer}
                    options={servers?.map((server) => server.addr)}
                    renderInput={(params) => <TextField {...params} label='choose server'/>}
                />
                <Typography variant='h5' gutterBottom component='h5'>
                    Add server
                </Typography>
                <TextField
                    fullWidth
                    className='login-text-field'
                    label='enter server key'
                    value={data}
                    onChange={e => setData(e.target.value)}
                />
                <Button
                    className='server-send-button'
                    variant='contained'
                    onClick={handleAddServer}>
                    ADD
                </Button>
            </div>
        </Paper>
    );
}

export default Server;
