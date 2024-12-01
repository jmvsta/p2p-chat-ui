import {create} from 'zustand';
import axios from 'axios';
import {Chat, ExtUser, Message, Server, StoreState} from './index.d';

export const apiUrl = process.env.apiUrl;

const chatsComparator = (first: Chat, second: Chat) =>
    first.last_active.localeCompare(second.last_active);

export const messageComparator = (first: Message, second: Message) =>
    first.time.localeCompare(second.time)

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
        const apiRequests = [];

        if (get().selectedChat !== null) {
            apiRequests.push({
                key: 'messages',
                request: () =>
                    axios.get(`${apiUrl}/api/msgs/chat/?chat_id=${get().selectedChat.id}&offset=0&limit=10`),
                errorMessage: 'Error fetching new messages',
            });
            apiRequests.push({
                key: 'contacts',
                request: () => axios.get(`${apiUrl}/api/users/list`),
                errorMessage: 'Error fetching users',
            });
        }

        if (!get().apiInited) {
            apiRequests.push({
                key: 'init',
                request: () => axios.get(`${apiUrl}/api/settings/status/`),
                errorMessage: 'Init api status request error',
            });
        } else {
            // FIXME: chats pagination
            apiRequests.push({
                key: 'chats',
                request: () => axios.get(`${apiUrl}/api/chats/list/?offset=0&limit=10&filter_banned=false`),
                errorMessage: 'Error fetching chats',
            });
            apiRequests.push({
                key: 'currentUser',
                request: () => axios.get(`${apiUrl}/api/settings/me/`),
                errorMessage: 'Error fetching user\'s data',
            });
            apiRequests.push({
                key: 'servers',
                request: () => axios.get(`${apiUrl}/api/servers/list`),
                errorMessage: 'Servers request error:',
            });
        }

        const results = await Promise.allSettled(
            apiRequests.map((api) => api.request())
        )
        results.forEach((result, index) => {
            const {key, errorMessage} = apiRequests[index];
            if (result.status === 'fulfilled') {
                switch (key) {
                    case 'init':
                        set({apiInited: result.value.data.inited});
                        break;
                    case 'currentUser':
                        set({currentUser: result.value.data});
                        break;
                    case 'servers':
                        set({servers: result.value.data.servers});
                        break;
                    case 'contacts':
                        set({contacts: result.value.data.users});
                        break;
                    case 'chats':
                        set({chats: result.value.data.chats?.sort(chatsComparator)});
                        break;
                    case 'status':
                        set({apiInited: result.value.data.inited});
                        break;
                    case 'messages': {
                        const messages = result.value.data.msgs || [];
                        const idsSet = get().idsSet;
                        const newMessages = messages
                            .filter((msg) => !idsSet.has(msg.id))
                            .sort(messageComparator);

                        if (newMessages.length > 0) {
                            set((state) => ({
                                messages: [...state.messages, newMessages],
                            }));

                            set((state) => {
                                newMessages.forEach((msg) => state.idsSet.add(msg.id));
                                return {idsSet: state.idsSet}
                            });
                        }
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