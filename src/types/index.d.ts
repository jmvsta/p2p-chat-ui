export interface Entity {
    id?: string;
    chat?: string;
    path?: string;
    name?: string;
    text?: string;
    file?: File;
}

export interface File extends Entity {
    size?: string;
    user_id?: string;
    file_id?: string;
    originalname?: string;
}

export interface Message extends Entity {
    sender?: string;
    chat_id?: string;
    time?: string;
    payload?: Payload;
    received?: boolean;
    read?: boolean;
}

export interface Payload {
    type?: string;
    data?: string;
}

export interface Chat extends Entity {
    last_msg_txt?: string;
    last_msg_user?: bigint;
    read?: boolean;
    last_active?: string;
}

export interface Server extends Entity {
    addr?: string;
    key_code?: string;
    status?: string;
    last_check?: string;
}

export interface User {
    id?: string;
    name?: string;
    pic?: string;
    key_code?: string;
    priv_key?: string,
    pub_key?: string,
    description?: string
}

