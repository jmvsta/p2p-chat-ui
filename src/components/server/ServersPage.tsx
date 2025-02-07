import {Typography} from '@mui/material';
import React, {useEffect} from 'react';
import ServersList from "./ServersList";
import {useStore} from "../../Store";
import {useNavigate} from "react-router";
import ServerButton from "./ServerButton.tsx";

interface Props {
    style?: React.CSSProperties;
}

const ServersPage: React.FC<Props> = (props) => {

    const apiInited = useStore((state) => state.apiInited);
    const navigate = useNavigate();

    useEffect(() => {
        if (!apiInited) {
            navigate('/login');
        }
    }, [apiInited]);

    return (
        <div style={{...props?.style, display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            <div style={{width: '50%'}}>
                <img style={{height: '50%', margin: '0 auto'}} src='/logo_1.jpg' alt='logo'/>
                <Typography sx={{alignSelf: 'center', width: '80%'}} variant='h6' gutterBottom>
                    This secure chat will help you to communicate without sacrificing your safety. Connect
                    freely, use it anywhere, anonymously.
                </Typography>
            </div>
            <ServersList buttons={<ServerButton id='skip-button' name={'SKIP'} onClick={() => navigate('/')}
                                  style={{width: '100% !import', height: '100% !import'}}/>}/>
        </div>
    );
}

export default ServersPage;
