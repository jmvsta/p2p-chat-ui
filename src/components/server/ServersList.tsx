import {List, ListItem, ListItemText, TextField, Typography} from '@mui/material';
import {Server} from '../../types';
import React, {ReactNode, useState} from 'react';
import ServerService from '../../services/ServerService.ts';
import {useNavigate} from 'react-router';
import {useStore} from '../../Store';
import ServerButton from './ServerButton';

interface Props {
    style?: React.CSSProperties;
    width?: string;
    buttons?: ReactNode;
}

const serversPopupDefaultStyle: React.CSSProperties = {
    flex: '0 0 50%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    alignItems: 'flex-start',
    justifyContent: 'center'
};

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

    const handleRemoveItem = (server: Server) => {
        serverService
            .delete(server.id)
            .then(() => {
                setServers(servers.filter(s => s.id !== server.id));
            })
            .catch(console.error)
    }

    return (
        <div id='server-component' style={{...serversPopupDefaultStyle, ...props?.style}}>
            <Typography variant='h5' gutterBottom>Servers list</Typography>
            <List sx={{width: props?.width ?? '100%'}}>
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
            <Typography variant='h5' gutterBottom>Add server</Typography>
            <TextField
                id='server-key-input'
                sx={{width: props?.width ?? '100%', margin: '5px 0'}}
                label='enter server key'
                value={serverKey}
                onChange={e => setServerKey(e.target.value)}
            />
            <div style={{display: 'flex', alignItems: 'flex-end', gap: '5px', width: props?.width ?? '100%'}}>
                <ServerButton id='add-server-button' name={'ADD'} onClick={handleAddServer}/>
                {props?.buttons}
            </div>
        </div>)
}

export default ServersList;