import {create} from 'zustand';
import {Chat, ExtUser, Message, Server, StoreState} from './types';

export const useStore = create<StoreState>((set, get) => ({

    currentUser: null,
    servers: [],
    contacts: [],
    chats: [],
    selectedChat: null,
    apiInited: false,
    messages: [],
    idsSet: new Set<number>(),

    infoPopupOpen: false,
    infoPopupTitle: '',
    infoPopupMessage: '',
    infoPopupButtonText: 'OK',
    infoPopupAction: () => {
    },

    contactPopupOpen: false,
    contactPopupUser: null,
    contactPopupAction: '',
    contactPopupTitle: '',
    contactPopupMessage: '',

    contactsPopupOpen: false,

    chatPopupOpen: false,
    chatPopupChat: null,
    chatPopupTitle: '',
    chatPopupAction: null,

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

    closeInfoPopup: (): void => set({infoPopupOpen: false}),
    openInfoPopup: (title: string, message: string, buttonText?: string, action?: () => void) => {
        set({infoPopupOpen: true});
        set({infoPopupTitle: title});
        set({infoPopupMessage: message});
        set({infoPopupButtonText: buttonText ? buttonText : 'OK'});
        set({
            infoPopupAction: action ? action : () => {
            }
        });
    },

    openContactPopup: (action: string, user: ExtUser | null): void => {
        set({contactPopupOpen: true})
        set({contactPopupAction: action})
        set({contactPopupUser: user})
    },
    closeContactPopup: (): void => {
        set({contactPopupOpen: false})
        set({contactPopupAction: ''})
        set({contactPopupUser: null})
    },
    openContactsPopup: (open: boolean): void => set({contactsPopupOpen: open}),

    closeChatPopup: () => {
        set({chatPopupAction: null});
        set({chatPopupChat: null});
        set({chatPopupOpen: false});
        set({chatPopupTitle: null});
    },
    openChatPopup: (action: string, chat: Chat | null, title: string) => {
        set({chatPopupAction: action});
        set({chatPopupChat: chat});
        set({chatPopupOpen: true});
        set({chatPopupTitle: title});
    },
    listEditPopupTitle: '',
    listEditPopupOpen: false,
    listEditPopupUpdateFunction: () => {},
    listEditPopupContent: null,
    listEditPopupButtons: [],
    openListEditPopup: (title: string | null, updateFunction: any | null, content: any, buttons: any[]) => {
        set({listEditPopupTitle: title});
        set({listEditPopupOpen: true});
        set({listEditPopupUpdateFunction: updateFunction});
        set({listEditPopupContent: content});
        set({listEditPopupButtons: buttons});
    },
    closeListEditPopup: () => {
        set({listEditPopupOpen: false});
        set({listEditPopupTitle: ''});
        set({listEditPopupUpdateFunction: () => {}});
        set({listEditPopupContent: null});
        set({listEditPopupButtons: []});
    }
}));