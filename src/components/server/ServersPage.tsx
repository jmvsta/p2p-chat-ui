import {Typography} from '@mui/material';
import React from 'react';
import ServersList from './ServersList';
import {useNavigate} from 'react-router';
import ServerButton from './ServerButton';

interface Props {
    style?: React.CSSProperties;
}

const ServersPage: React.FC<Props> = (props) => {

    const navigate = useNavigate();

    return (
        <div style={{...props?.style, display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'column', width: '50%', margin: '10px'}}>
                <img style={{width: '50% 0', alignSelf: 'center'}} src='/logo_1.jpg' alt='logo'/>
                <Typography sx={{alignSelf: 'center', width: '80%'}} variant='h6' gutterBottom>
                    This secure chat will help you to communicate without sacrificing your safety. Connect
                    freely, use it anywhere, anonymously.
                </Typography>
            </div>
            <ServersList style={{flex: '0 0 50%'}} width={'50%'} buttons={<ServerButton id='next-button' name={'NEXT'} onClick={() => navigate('/')}/>}/>
        </div>
    );
}

export default ServersPage;
