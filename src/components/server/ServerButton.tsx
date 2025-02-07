import {Button} from '@mui/material';
import React from "react";

interface Props {
    id: string;
    name: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const ServerButton: React.FC<Props> = (props) => {

    const buttonStyle = {
        width: '30%',
        alignSelf: 'flex-start',
        margin: '5px 0',
        backgroundColor: '#000000',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#000000',
        },
    };

    return (
        <Button
            id={props.id}
            key={props.id}
            style={{...props.style}}
            sx={buttonStyle}
            variant='contained'
            onClick={() => props.onClick && props.onClick()}>
            {props.name}
        </Button>)
};

export default ServerButton;