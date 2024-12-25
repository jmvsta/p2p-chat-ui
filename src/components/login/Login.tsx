import {Box, Button, IconButton, TextField, Typography} from '@mui/material';
import React, {RefObject, useState} from 'react';
import {useStore} from '../../Store';
import AddLinkIcon from '@mui/icons-material/AddLink';
import UserService from "../../services/UserService";
import ApiSettingsService from "../../services/ApiSettingsService";

interface Props {
    style?: React.CSSProperties;
}

const Login: React.FC<Props> = (props) => {

    const [login, setLogin] = useState('');
    const [photo, setPhoto] = useState<Blob | null>(null);
    const [password, setPassword]: [string, (password: string) => void] = useState('');
    const [fileName, setFileName] = useState('');
    const fileInputRef: RefObject<any> = React.createRef();
    const setApiInited = useStore((state) => state.setApiInited);
    const showInfoPopup = useStore((state) => state.showInfoPopup);
    const userService = new UserService();
    const apiService = new ApiSettingsService();

    const handleLogin = () => {
        if (login === '' || password === '' || photo === null) {
            showInfoPopup('Error', 'All fields are required');
            return;
        }

        Promise.all([
            apiService.create(password),
            userService.update(login, photo)
        ])
            .then(() => setApiInited(true))
            .catch((error: Error) => {
                console.error('Login: Api init get error: ', error);
                showInfoPopup('Error', 'Login error');
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
        <Box style={{
            ...props?.style,
            flex: "0 0 50%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "none",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Typography variant='h5' gutterBottom>
                Complete registration to sign in
            </Typography>
            <TextField
                sx={{width: "60%", margin: "5px 0"}}
                variant='outlined'
                label='Enter login'
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <TextField
                sx={{width: "60%", margin: "5px 0"}}
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
                    id='upload-image'
                    hidden
                    accept='*/*'
                    type='file'
                    ref={fileInputRef}
                    onChange={handleAddFile}
                />
            </Box>
            <Button
                sx={{
                    width: "60%",
                    alignSelf: "center",
                    margin: "5px 0",
                    backgroundColor: "#000000",
                    "&:hover": {
                        backgroundColor: "#000000",
                    },
                }}
                variant='contained'
                onClick={handleLogin}
            >
                GO
            </Button>
        </Box>
    )
}
export default Login;
