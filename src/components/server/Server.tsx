import './Server.css'
import {Autocomplete, Button, Paper, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import {useStore} from '../../Store';
import ServerService from "../../services/ServerService";

interface Props {
    style?: React.CSSProperties;
}

const Server: React.FC<Props> = (props) => {

    const servers = useStore((state) => state.servers);
    const setSelectedServer = useStore((state) => state.setSelectedServer);
    const showInfoPopup = useStore((state) => state.showInfoPopup);
    const [serverKey, setServerKey] = useState('');
    const serverService = new ServerService();

    const handleChooseServer = (event, server) => {
        servers.forEach(serverWrapper => {
            if (serverWrapper.addr === server) {
                localStorage.setItem('server', JSON.stringify(serverWrapper))
                setSelectedServer(server)
            }
        })
    };

    const handleAddServer = () => {
        serverService
            .create(serverKey)
            .then(() => {
                showInfoPopup('Success', 'Added server successfully');
            })
            .catch(error => {
                console.error('Add server api request error: ', error);
                showInfoPopup('Error', 'Error adding server');
            })
            .finally(() => setServerKey(''));
    };

    return (
        <Paper className='server-wrapper' style={{...props?.style}}>
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
                    value={serverKey}
                    onChange={e => setServerKey(e.target.value)}
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
