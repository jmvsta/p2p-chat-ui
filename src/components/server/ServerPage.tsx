import {Autocomplete, Box, Button, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import {useStore} from '../../Store';
import ServerService from "../../services/ServerService";
import {Server} from '../../types';

interface Props {
    style?: React.CSSProperties;
}

const ServerPage: React.FC<Props> = (props) => {

    const servers = useStore((state) => state.servers);
    const setServers = useStore((state) => state.setServers);
    const setSelectedServer = useStore((state) => state.setSelectedServer);
    const showInfoPopup = useStore((state) => state.showInfoPopup);
    const [serverKey, setServerKey] = useState('');
    const serverService = new ServerService();

    const handleChooseServer = (server: Server | null) => {
        if (server) {
            localStorage.setItem('server', JSON.stringify(server))
            setSelectedServer(server.addr)
        }
    };

    const handleAddServer = () => {
        if (serverKey !== '') {
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
        } else {
            showInfoPopup('Error', 'Server key must be provided');
            return
        }
    };

    const handleRemoveServer = (server: Server) => {
        serverService
            .delete(server.id)
            .then(() => {
                setServers(servers.filter(s => s.id !== server.id));
            })
            .catch(error => {
                console.error('Add server api request error: ', error);
                // showInfoPopup('Error', 'Error adding server');
            })
    }

    return (
        <Box id='server-component' style={{
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
                id={'servers-autocomplete'}
                disablePortal
                sx={{width: "60%", margin: "5px 0"}}
                onChange={(_event, server) => handleChooseServer(server)}
                options={servers}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.addr)}
                renderOption={(props, option) => {
                    const { key, ...restProps } = props;
                    return (
                        <Box
                            key={key} {...restProps}
                            data-testid={`option-${option.id}`}
                            component="li"
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <span style={{flex: 1}}>{option.addr}</span>
                            <button
                                data-testid={`remove-${option.id}`}
                                style={{
                                    background: 'none',
                                    color: 'red',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    lineHeight: 1
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveServer(option);
                                }}
                            >
                                &times;
                            </button>
                        </Box>
                    )
                }}
                renderInput={(params) => <TextField {...params} label='choose server'
                                                    data-testid='autocomplete-input'/>}
            />
            <Typography variant='h5' gutterBottom sx={{
                textAlign: 'left',
                width: '60%',
            }}>
                Add server
            </Typography>
            <TextField
                id='server-key-input'
                sx={{width: "60%", margin: "5px 0"}}
                label='enter server key'
                value={serverKey}
                onChange={e => setServerKey(e.target.value)}
            />
            <Button
                id='add-server-button'
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

export default ServerPage;
