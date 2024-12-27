import {useCallback} from 'react';
import {Chat, Message} from '../types';
import {useStore} from '../Store';
import ApiSettingsService from "../services/ApiSettingsService";
import UserService from "../services/UserService";
import MessageService from "../services/MessageService";
import ChatService from "../services/ChatService";
import ServerService from "../services/ServerService";

export const useFetchData = () => {

    const {
        selectedChat,
        selectedServer,
        apiInited,
        idsSet,
        appendMessagesHead,
        addIdsToSet,
        setApiInited,
        setCurrentUser,
        setServers,
        setContacts,
        setChats,
    } = useStore();

    const apiService = new ApiSettingsService();
    const userService = new UserService();
    const messageService = new MessageService();
    const chatService = new ChatService();
    const serverService = new ServerService();

    return useCallback(async (): Promise<void> => {
        const apiRequests: any[] = [];

        if (selectedChat !== null) {
            apiRequests.push({
                key: 'messages',
                request: () => messageService.read(selectedChat.id, 0, 10),
                errorMessage: 'Error fetching new messages',
            });
            apiRequests.push({
                key: 'contacts',
                request: () => userService.read(),
                errorMessage: 'Error fetching users',
            });
        }

        if (!apiInited) {
            apiRequests.push({
                key: 'init',
                request: () => apiService.read(),
                errorMessage: 'Init API status request error',
            });
        } else {
            apiRequests.push({
                key: 'currentUser',
                request: () => userService.readCurrent(),
                errorMessage: 'Error fetching user\'s data',
            });
            apiRequests.push({
                key: 'chats',
                request: () => chatService.read(0, 1000, true),
                errorMessage: 'Error fetching chats',
            });
        }

        if (!selectedServer) {
            apiRequests.push({
                key: 'servers',
                request: () => serverService.read(),
                errorMessage: 'Server request error',
            });
        }

        const results = await Promise.allSettled(apiRequests.map((api) => api.request()));

        results.forEach((result, index) => {
            const {key, errorMessage} = apiRequests[index];
            if (result.status === 'fulfilled') {
                switch (key) {
                    case 'init':
                        setApiInited(result.value.data.inited);
                        break;
                    case 'currentUser':
                        setCurrentUser(result.value.data);
                        break;
                    case 'servers':
                        setServers(result.value.data.servers);
                        break;
                    case 'contacts':
                        setContacts(result.value.data.users);
                        break;
                    case 'chats':
                        setChats(
                            result.value.data.chats?.sort((first: Chat, second: Chat) =>
                                first.last_active.localeCompare(second.last_active)
                            )
                        );
                        break;
                    case 'messages': {
                        const messages = result.value.data.msgs || [];
                        const newMessages = messages.filter((msg: Message) => !idsSet.has(msg.id));
                        if (newMessages.length > 0) {
                            appendMessagesHead(newMessages);
                            addIdsToSet(newMessages.map((msg: Message) => msg.id));
                        }
                        break;
                    }
                    default:
                        console.warn(`Unknown key: ${key}`);
                }
            } else {
                console.error(errorMessage, result.reason);
            }
        });
    }, [selectedChat, selectedServer, apiInited, idsSet]);
};
