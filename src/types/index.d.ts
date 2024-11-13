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
    uuid?: string;
    user?: string;
    sent?: boolean;
    read?: boolean;
}

export interface Chat extends Entity {
    last_msg?: string;
    new?: boolean;
}

export interface Server extends Entity {
    addr?: string;
    key_code?: string;
    status?: string;
}

export interface User {
    uuid: string;
    name: string;
    pic: string;
    key_code: string;
    priv_key?: string,
    pub_key?: string,
    description?: string
}



