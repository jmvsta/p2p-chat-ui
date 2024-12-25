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

export interface Chat {
    id: string;
    name: string;
    last_msg_txt?: string;
    last_msg_user?: number;
    read: boolean;
    last_active: string;
}

export interface Server {
    id: string;
    addr: string;
    status: string;
    last_check: string;
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
    selectedServer: string | null,
    messages: Message[],
    idsSet: Set<number>,

    infoPopupOpen: boolean,
    infoPopupTitle: string,
    infoPopupMessage: string,
    infoPopupButtonText: string,

    contactPopupOpen: boolean,
    contactPopupTitle: string,
    contactPopupMessage: string,

    chatPopupOpen: boolean,
    chatPopupTitle: string,
    chatPopupMessage: string,

    setCurrentUser: (user: ExtUser | null) => void,
    setServers: (servers: Server[]) => void,
    setChats: (chats: Chat[]) => void,
    deleteChat: (chat: Chat | null) => void,
    setContacts: (users: ExtUser[]) => void,
    setSelectedChat: (chat: Chat | null) => void,
    setMessages: (messages: Message[]) => void,
    appendMessagesHead: (messages: Message[]) => void,
    appendMessagesTail: (messages: Message[]) => void,
    setIdsSet: (idsSet: Set<number>) => void,
    addIdsToSet: (ids: number[]) => void,
    setApiInited: (inited: boolean) => void,
    setSelectedServer: (server: string | null) => void,

    setInfoPopupOpen: (open: boolean) => void,
    showInfoPopup: (title: string, message: string, buttonText?: string) => void,

    setContactPopupOpen: (open: boolean) => void,
    showContactPopup: () => void,

    setChatPopupOpen: (open: boolean) => void,
    showChatPopup: (title: string, message: string) => void
}