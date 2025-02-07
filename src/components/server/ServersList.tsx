import {Box, List, ListItem, ListItemText, TextField, Typography} from '@mui/material';
import {Server} from '../../types';
import React, {ReactNode, useState} from 'react';
import ServerService from '../../services/ServerService.ts';
import {useNavigate} from 'react-router';
import {useStore} from '../../Store';
import ServerButton from "./ServerButton.tsx";

interface Props {
    style?: React.CSSProperties;
    buttons?: ReactNode;
}

const ServersList: React.FC<Props> = (props) => {

    const servers = useStore((state) => state.servers);
    const setServers = useStore((state) => state.setServers);
    const openInfoPopup = useStore((state) => state.openInfoPopup);
    const [serverKey, setServerKey] = useState('');
    const serverService = new ServerService();
    const navigate = useNavigate();

    const handleAddServer = () => {
        if (serverKey !== '') {
            serverService
                .create(serverKey)
                .then(() => {
                    openInfoPopup('Success', 'Added server successfully', 'OK', () => navigate('/'));
                })
                .catch(error => {
                    console.error('Add server api request error: ', error);
                    openInfoPopup('Error', 'Error adding server');
                })
                .finally(() => setServerKey(''));
        } else {
            openInfoPopup('Error', 'Server key must be provided');
        }
    };
    // const buttons = [,
    //     <ServerButton id='skip-button' name={'SKIP'} onClick={() => navigate('/')}
    //                   style={{width: '100% !import', height: '100% !import'}}/>]

    const handleRemoveItem = (server: Server) => {
        serverService
            .delete(server.id)
            .then(() => {
                setServers(servers.filter(s => s.id !== server.id));
            })
            .catch(console.error)
    }

    return (
        <Box id='server-component' style={{
            ...props?.style,
            flex: '0 0 50%',
            width: '50%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
            alignItems: 'left',
            justifyContent: 'center'
        }}>
            <Typography variant='h5' gutterBottom sx={{
                textAlign: 'left',
                width: '60%',
            }}>
                Servers list
            </Typography>
            <List style={{overflowY: 'auto', alignItems: 'left', width: '60%'}}>
                {servers?.map((server: Server) => (
                    <ListItem key={server.id}
                              sx={{
                                  padding: '10px',
                                  cursor: 'pointer',
                                  '&:hover': {
                                      backgroundColor: '#a9a9a9',
                                  },
                              }}
                    >
                        <ListItemText
                            sx={{
                                marginLeft: '1rem',
                                '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                },
                            }}
                            primary={server.addr}
                        />
                        <button
                            data-testid={`remove-server-${server.id}`}
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
                                handleRemoveItem(server);
                            }}
                        >
                            &times;
                        </button>
                    </ListItem>
                ))}
            </List>
            <Typography variant='h5' gutterBottom sx={{
                textAlign: 'left',
                width: '60%',
            }}>
                Add server
            </Typography>
            <TextField
                id='server-key-input'
                sx={{width: '60%', margin: '5px 0'}}
                label='enter server key'
                value={serverKey}
                onChange={e => setServerKey(e.target.value)}
            />
            <div style={{display: 'flex', gap: '5px'}}>
                <ServerButton id='add-server-button' name={'ADD'} onClick={handleAddServer}
                              style={{width: '100% !import', height: '100% !import'}}/>
                {props?.buttons}
            </div>
        </Box>)
}

export default ServersList;