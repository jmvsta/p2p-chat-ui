import {Box, Button, List, ListItem, ListItemText, TextField, Typography} from '@mui/material';
import React, {useState} from 'react';
import {useStore} from '../../Store';
import ServerService from '../../services/ServerService';
import {Server} from '../../types';
import {useNavigate} from "react-router";

interface Props {
    style?: React.CSSProperties;
}

const ServersPage: React.FC<Props> = (props) => {

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

    const handleRemoveItem = (server: Server) => {
        serverService
            .delete(server.id)
            .then(() => {
                setServers(servers.filter(s => s.id !== server.id));
            })
            .catch(console.error)
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <div style={{width: '50%'}}>
                <img className='logo-img' src='/logo_1.jpg' alt='logo'/>
                <Typography className='text-field' variant='h6' gutterBottom>
                    This secure chat will help you to communicate without sacrificing your safety. Connect
                    freely, use it anywhere, anonymously.
                </Typography>
            </div>
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
                <Button
                    id='add-server-button'
                    sx={{
                        width: '60%',
                        alignSelf: 'left',
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
        </div>
    );
}

export default ServersPage;
