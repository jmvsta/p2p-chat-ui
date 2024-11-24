import React from 'react';
import {Message} from '../../types';
import {ListItemText} from '@mui/material';

interface Props {
    message: Message;
}

const UserMessage: React.FC<Props> = (props) => {

    return (
        <div>
            <div className='user-name'>
                {props.message.sender || 'Unknown User'}
            </div>
            {props.message.file != null ?
                <img
                    className='image'
                    src={props.message.file.name}
                    alt={props.message.text}
                    onError={(e) => console.error(e)}
                /> :
                <ListItemText
                    className='message'
                    primary={props.message?.payload?.data}
                    classes={{primary: 'moved-text'}}/>
            }
        </div>
    )
}

export default UserMessage;