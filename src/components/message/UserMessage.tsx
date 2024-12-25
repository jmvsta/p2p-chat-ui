import React from 'react';
import {ExtUser, Message} from '../../types';
import {Avatar, Box, Button, Typography} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'
import FileService from "../../services/FileService";

interface Props {
    message: Message;
    user: ExtUser | null | undefined;
}

const UserMessage: React.FC<Props> = (props) => {

    const fileService = new FileService();

    const handleDownload = () => {
        fileService
            .read(props.message.id)
            .catch((error) => console.error(`Error downloading file, msg.id = ${props.message.id}:`, error));
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Avatar
                    src={props.user?.pic}
                    alt='avatar'
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: props.user?.pic ? 'transparent' : 'black',
                    }}
                />
                <Typography variant='body1' fontWeight='bold'>
                    {props.user?.name || 'Unknown User'}
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