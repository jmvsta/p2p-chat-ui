import {Box, Button, IconButton, TextField, Typography} from '@mui/material';
import React, {RefObject, useEffect, useState} from 'react';
import {useStore} from '../../Store';
import AddLinkIcon from '@mui/icons-material/AddLink';
import {useServices} from '../../Providers';
import {useNavigate} from 'react-router';

interface Props {
    style?: React.CSSProperties;
}

const LoginPage: React.FC<Props> = (props) => {

    const [login, setLogin] = useState('');
    const [photo, setPhoto] = useState<Blob | null>(null);
    const [password, setPassword]: [string, (password: string) => void] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef: RefObject<any> = React.createRef();
    const setApiInited = useStore((state) => state.setApiInited);
    const openInfoPopup = useStore((state) => state.openInfoPopup);
    const apiInited = useStore((state) => state.apiInited);
    const {settingsService} = useServices();
    const navigate = useNavigate();

    useEffect(() => {
        if (apiInited) {
            navigate('/');
        }
    }, [apiInited]);
    
    const handleLogin = () => {
        if (login === '' || password === '' || photo === null) {
            openInfoPopup('Error', 'All fields are required');
            return;
        }

        Promise.all([
            settingsService.create(password),
            settingsService.updateCurrent(login, photo)
        ])
            .then(() => {
                setApiInited(true);
                navigate('/servers');
            })
            .catch((error: Error) => {
                console.error('LoginPage: Api init get error: ', error);
                openInfoPopup('Error', 'LoginPage error');
            })
            .finally(() => {
                setPhoto(null);
                setLogin('');
                setPassword('');
                setFileName('');
            })
    };

    const handleIconButtonClick = () => fileInputRef.current.click();

    const handleAddFile = (event: any) => {
        const files = event.target.files;
        if (!files) return;
        setPhoto(files[0]);
        setFileName(files[0]?.name);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <div style={{width: '50%'}}>
                <img style={{height: '50%', margin: '0 auto'}} src='/logo.jpg' alt='logo image'/>
                <Typography sx={{alignSelf: 'center', width: '80%'}} variant='h6' gutterBottom>
                    This secure chat will help you to communicate without sacrificing your safety. Connect
                    freely, use it anywhere, anonymously.
                </Typography>
            </div>
            <Box id='login-component' style={{
                ...props?.style,
                flex: '0 0 50%',
                width: '50%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography variant='h5' gutterBottom>
                    Complete registration to sign in
                </Typography>
                <TextField
                    id='login-input'
                    sx={{width: '60%', margin: '5px 0'}}
                    variant='outlined'
                    label='Enter login'
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <TextField
                    id='password-input'
                    sx={{width: '60%', margin: '5px 0'}}
                    variant='outlined'
                    label='Enter password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Box
                    margin='5px 0'
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    width='60%'
                    mb={1}
                >
                    <TextField
                        fullWidth
                        variant='outlined'
                        value={fileName || 'No file selected'}
                        disabled
                        label='Uploaded File'
                    />
                    <IconButton edge='start' onClick={handleIconButtonClick}>
                        <AddLinkIcon/>
                    </IconButton>
                    <input
                        id='file-input'
                        hidden
                        accept='*/*'
                        type='file'
                        ref={fileInputRef}
                        onChange={handleAddFile}
                    />
                </Box>
                <Button
                    id='login-button'
                    sx={{
                        width: '60%',
                        alignSelf: 'center',
                        margin: '5px 0',
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#000000',
                        },
                    }}
                    variant='contained'
                    onClick={handleLogin}
                >
                    GO
                </Button>
            </Box>
        </div>
    )
}
export default LoginPage;
