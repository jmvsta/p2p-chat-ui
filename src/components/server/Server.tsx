import {Autocomplete, Box, Button, TextField, Typography} from '@mui/material';
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

    const handleChooseServer = (server: string | null) => {
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
        <Box className='server-wrapper' style={{
            ...props?.style,
            flex: "0 0 50%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "none",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Typography variant='h5' gutterBottom sx={{
                textAlign: 'left',
                width: '60%',
            }}>
                Select server from list
            </Typography>
            <Autocomplete
                disablePortal
                sx={{width: "60%", margin: "5px 0"}}
                onChange={(_event, value) => handleChooseServer(value)}
                options={servers?.map((server) => server.addr)}
                renderInput={(params) => <TextField {...params} label='choose server'/>}
            />
            <Typography variant='h5' gutterBottom sx={{
                textAlign: 'left',
                width: '60%',
            }}>
                Add server
            </Typography>
            <TextField
                sx={{width: "60%", margin: "5px 0"}}
                label='enter server key'
                value={serverKey}
                onChange={e => setServerKey(e.target.value)}
            />
            <Button
                sx={{
                    width: '60%',
                    alignSelf: 'center',
                    margin: '5px 0',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#000000',
                    },
                }}
                variant='contained'
                onClick={handleAddServer}>
                ADD
            </Button>
        </Box>
    );
}

export default Server;
