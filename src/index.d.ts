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

export interface Message {
    id: number;
    sender?: number;
    chat_id: string;
    time?: string;
    payload: Payload;
    received: boolean;
    read: boolean;
}

export interface Payload {
    type: string;
    data: string;
    path: string;
    downloaded: boolean;
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
    id: string;
    name: string;
    pic?: string;
    key_code?: string;
}

export interface ExtUser {
    id: number;
    ext_id: string;
    key_code: string;
    hkey_code: string;
    name: string,
    pic: string,
    status: string,
    activity: string
}

interface StoreState {
    currentUser: ExtUser | null,
    servers: Server[],
    chats: Chat[],
    contacts: ExtUser[],
    selectedChat: Chat | null,
    apiInited: boolean,
    selectedServer: Server | null,
    messages: Message[],
    idsSet: Set<bigint>,

    infoPopupOpen: boolean,
    infoPopupTitle: string,
    infoPopupMessage: string,

    contactPopupOpen: boolean,
    contactPopupTitle: string,
    contactPopupMessage: string,

    chatPopupOpen: boolean,
    chatPopupTitle: string,
    chatPopupMessage: string,

    setCurrentUser: (user: ExtUser) => void,
    setServers: (servers: Server[]) => void,
    setChats: (chats: Chat[]) => void,
    deleteChat: (chat: Chat) => void,
    setContacts: (users: ExtUser[]) => void,
    setSelectedChat: (chat: Chat) => void,
    setMessages: (messages: Message[]) => void,
    appendMessagesHead: (messages: Message[]) => void,
    setIdsSet: (idsSet: Set<bigint>) => void,
    addIdsToSet: (ids: bigint[]) => void,
    setApiInited: (inited: boolean) => void,
    setSelectedServer: (server: Server) => void,

    setInfoPopupOpen: (open: boolean) => void,
    showInfoPopup: (title: string, message: string) => void,

    setContactPopupOpen: (open: boolean) => void,
    showContactPopup: () => void,

    setChatPopupOpen: (open: boolean) => void,
    showChatPopup: (title: string, message: string) => void,

    fetchData: () => void,
}