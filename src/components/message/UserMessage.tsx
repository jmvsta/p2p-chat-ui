import React, {useState} from 'react';
import {Message} from '../../index.d';
import {Avatar, Box, Button, Typography} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'
import axios from 'axios';
import {apiUrl} from '../../App';
import './UserMessage.css';
import useStore from '../../Store';

interface Props {
    message: Message;
}

const UserMessage: React.FC<Props> = (props) => {

    const me = useStore((state) => state.currentUser);
    const users = useStore((state) => state.contacts);

    const [user, setUser] = useState(props.message.sender != null ? users?.find(u =>
        u.id === props.message.sender) : me);

    const handleDownload = () => {
        axios.post(`${apiUrl}/api/downloads/start?msg_id=${props.message.id}`)
            .catch(error => console.error(`Error downloading file, msg.id = ${props.message.id}:`, error));

    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Avatar
                    src={user?.pic}
                    alt='avatar'
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: user?.pic ? 'transparent' : 'black',
                    }}
                />
                <Typography variant='body1' fontWeight='bold'>
                    {user?.name || 'Unknown User'}
                </Typography>
            </Box>

            <Box sx={{ml: '50px'}}>
                {(props.message.payload.downloaded ||
                    props.message.payload.type !== 'file') && (
                    <Typography
                        variant='body2'
                        color='textSecondary'
                        sx={{mb: 1}}
                    >
                        {props.message?.payload?.data}
                    </Typography>
                )}

                {props.message.payload.type === 'file' &&
                    !props.message.payload.downloaded && (
                        <Button
                            variant='contained'
                            color='primary'
                            startIcon={<DownloadIcon/>}
                            onClick={handleDownload}
                        >
                            Download
                        </Button>
                    )}
            </Box>
        </Box>
    )
};

export default UserMessage;