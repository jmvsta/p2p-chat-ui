import {create} from 'zustand';
import {Chat, ExtUser, Message, Server, StoreState} from './types';

export const useStore = create<StoreState>((set, get) => ({

    currentUser: null,
    servers: [],
    contacts: [],
    chats: [],
    selectedChat: null,
    apiInited: false,
    selectedServer: JSON.parse(<string>localStorage.getItem('server')),
    messages: [],
    idsSet: new Set<number>(),

    infoPopupOpen: false,
    infoPopupTitle: '',
    infoPopupMessage: '',
    infoPopupButtonText: 'OK',

    contactPopupOpen: false,
    contactPopupTitle: '',
    contactPopupMessage: '',

    chatPopupOpen: false,
    chatPopupTitle: '',
    chatPopupMessage: '',

    setCurrentUser: (user: ExtUser | null): void => set({currentUser: user}),
    setServers: (servers: Server[]): void => set({servers: servers}),
    setMessages: (messages: Message[]): void => set({messages: messages}),
    appendMessagesHead: (messages: Message[]): void => set({messages: [...messages, ...get().messages]}),
    appendMessagesTail: (messages: Message[]): void => set({messages: [...get().messages, ...messages]}),
    addIdsToSet: (ids: number[]) =>
        set((state) => {
            ids.forEach((id) => state.idsSet.add(id))
            return {idsSet: state.idsSet}
        }),
    setIdsSet: (idsSet: Set<number>): void => set({idsSet: idsSet}),
    setChats: (chats: Chat[]): void => set({chats: chats}),
    deleteChat: (chat: Chat | null): void => set({chats: get().chats.filter(item => item !== chat)}),
    setContacts: (users: ExtUser[]): void => set({contacts: users}),
    setSelectedChat: (chat: Chat | null): void => {
        set({selectedChat: chat});
        set({idsSet: new Set()});
        set({messages: []});
    },
    setApiInited: (inited: boolean): void => set({apiInited: inited}),
    setSelectedServer: (server: string | null): void => set({selectedServer: server}),

    setInfoPopupOpen: (open: boolean): void => set({infoPopupOpen: open}),
    showInfoPopup: (title: string, message: string, buttonText?: string) => {
        set({infoPopupOpen: true});
        set({infoPopupTitle: title});
        set({infoPopupMessage: message});
        set({infoPopupButtonText: buttonText ? buttonText : 'OK'});
    },

    setContactPopupOpen: (open: boolean): void => set({contactPopupOpen: open}),
    showContactPopup: () => {
        set({contactPopupOpen: true});
    },

    setChatPopupOpen: (open: boolean) => set({chatPopupOpen: open}),
    showChatPopup: (title: string, message: string) => {
        set({chatPopupOpen: true});
        set({chatPopupTitle: title});
        set({chatPopupMessage: message});
    }
}));