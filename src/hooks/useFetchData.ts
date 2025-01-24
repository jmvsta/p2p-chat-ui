import {useCallback} from 'react';
import {Message} from '../types';
import {useStore} from '../Store';
import {chatsComparator} from '../services/ChatService';
import {useServices} from '../services/ServiceProvider';

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

    const {settingsService, userService, messageService, chatService, serverService} = useServices();

    return useCallback(async (): Promise<void> => {
        const apiRequests: any[] = [];

        if (selectedChat !== null) {
            apiRequests.push({
                key: 'messages',
                request: () => messageService.read(selectedChat.id, 0, 10),
                errorMessage: 'Error fetching new messages',
            });
        }

        if (!apiInited) {
            apiRequests.push({
                key: 'init',
                request: () => settingsService.read(),
                errorMessage: 'Init API status request error',
            });
        } else {
            apiRequests.push({
                key: 'currentUser',
                request: () => settingsService.readCurrent(),
                errorMessage: 'Error fetching user\'s data',
            });
            apiRequests.push({
                key: 'contacts',
                request: () => userService.read(),
                errorMessage: 'Error fetching users',
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
                errorMessage: 'ServerPage request error',
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
                        setChats(result.value.data.chats?.sort(chatsComparator));
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
