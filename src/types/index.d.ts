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

export interface ChatDetails {
    id: string;
    name: string;
    participants: number[];
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

export interface StoreState {
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
    contactPopupUser: ExtUser | null,
    contactPopupAction: string,
    contactPopupTitle: string,
    contactPopupMessage: string,

    contactsPopupOpen: boolean,

    chatPopupOpen: boolean,
    chatPopupChat: Chat | null,
    chatPopupTitle: string | null,
    chatPopupAction: string | null,

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

    closeInfoPopup: () => void,
    openInfoPopup: (title: string, message: string, buttonText?: string) => void,

    openContactPopup: (action: string, user: ExtUser | null) => void,
    closeContactPopup: () => void,

    setContactsPopupOpen: (open: boolean) => void,
    
    closeChatPopup: () => void,
    openChatPopup: (action: string, chat: Chat | null, title: string) => void
}