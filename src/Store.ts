import {create} from 'zustand';
import axios from 'axios';
import {Chat, ExtUser, Message, Server, StoreState} from './index.d';

export const apiUrl = process.env.apiUrl;

const chatsComparator = (first: Chat, second: Chat) =>
    first.last_active.localeCompare(second.last_active);

export const messageComparator = (first: Message, second: Message) =>
    first.time.localeCompare(second.time)

const apiRequests = [
    {
        key: 'init',
        request: () => axios.get(`${apiUrl}/api/settings/status/`),
        errorMessage: 'Init api status request error',
    },
    {
        key: 'currentUser',
        request: () => axios.get(`${apiUrl}/api/settings/me/`),
        errorMessage: 'Error fetching user\'s data',
    },
    {
        key: 'servers',
        request: () => axios.get(`${apiUrl}/api/servers/list`),
        errorMessage: 'Servers request error:',
    },
    {
        key: 'contacts',
        request: () => axios.get(`${apiUrl}/api/users/list`),
        errorMessage: 'Error fetching users',
    },
    {
        key: 'chats',
        request: () => axios.get(`${apiUrl}/api/chats/list/?offset=-1&limit=10&filter_banned=false`),
        errorMessage: 'Error fetching chats',
    },
    {
        key: 'status',
        request: () => axios.get(`${apiUrl}/api/settings/status/`),
        errorMessage: 'Init status request error',
    },
    {
        key: 'messages',
        request: (state) =>
            axios.get(`${apiUrl}/api/msgs/chat/?chat_id=${state.selectedChat?.id || ''}&offset=0&limit=10`),
        errorMessage: 'Error fetching new messages',
    },
]

const useStore = create<StoreState>((set, get) => ({
    currentUser: null,
    servers: [],
    contacts: [],
    chats: [],
    selectedChat: null,
    apiInited: false,
    selectedServer: null,
    messages: [],
    idsSet: new Set<bigint>(),

    infoPopupOpen: false,
    infoPopupTitle: '',
    infoPopupMessage: '',

    contactPopupOpen: false,
    contactPopupTitle: '',
    contactPopupMessage: '',

    chatPopupOpen: false,
    chatPopupTitle: '',
    chatPopupMessage: '',

    setCurrentUser: (user: ExtUser): void => set({currentUser: user}),
    setServers: (servers: Server[]): void => set({servers: servers}),
    setMessages: (messages: Message[]): void => set({messages: messages}),
    appendMessagesHead: (messages: Message[]): void => set({messages: [...messages, ...get().messages]}),
    addIdsToSet: (ids: bigint[]) =>
        set((state) => {
            ids.forEach((id) => state.idsSet.add(id))
            return {idsSet: state.idsSet}
        }),
    setIdsSet: (idsSet: Set<bigint>): void => set({idsSet: idsSet}),
    setChats: (chats: Chat[]): void => set({chats: chats}),
    deleteChat: (chat: Chat): void => set({chats: get().chats.filter(item => item !== chat)}),
    setContacts: (users: ExtUser[]): void => set({contacts: users}),
    setSelectedChat: (chat: Chat): void => {
        set({selectedChat: chat});
        set({idsSet: new Set()});
        set({messages: []});
    },
    setApiInited: (inited: boolean): void => set({apiInited: inited}),
    setSelectedServer: (server: Server): void => set({selectedServer: server}),

    setInfoPopupOpen: (open: boolean): void => set({infoPopupOpen: open}),
    showInfoPopup: (title: string, message: string) => {
        set({infoPopupOpen: true});
        set({infoPopupTitle: title});
        set({infoPopupMessage: message});
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
    },
    fetchData: async () => {
        const results = await Promise.allSettled(
            apiRequests.map((api) => api.request)
        )
        results.forEach((result, index) => {
            const {key, errorMessage} = apiRequests[index]
            if (result.status === 'fulfilled') {
                const response = result.value;
                switch (key) {
                    case 'init':
                        set({apiInited: (response as any).inited});
                        break;
                    case 'currentUser':
                        set({currentUser: (response as any)});
                        break;
                    case 'servers':
                        set({servers: (response as any).servers});
                        break;
                    case 'contacts':
                        set({contacts: (response as any).users});
                        break;
                    case 'chats':
                        set({chats: (response as any).chats.sort(chatsComparator)})
                        break;
                    case 'status':
                        set({apiInited: (response as any).inited});
                        break;
                    case 'messages': {
                        const messages = (response as any).msgs || [];
                        const idsSet = get().idsSet;
                        const newMessages = messages
                            .filter((msg) => !idsSet.has(msg.id))
                            .sort(messageComparator);


                        set((state) => ({
                            messages: [...state.messages, newMessages],
                        }));

                        set((state) => {
                            newMessages.forEach((msg) => state.idsSet.add(msg.id));
                            return {idsSet: state.idsSet}
                        });
                        break;
                    }
                    default:
                        console.warn(`Unknown key: ${key}`)
                }
            } else {
                console.error(errorMessage, result.reason)
            }
        })
    },
}));

export default useStore;