import Service from './Service';
import {Chat} from '../types';

export const chatsComparator = (first: Chat, second: Chat) =>
    first.last_active.localeCompare(second.last_active);

export default class ChatService extends Service {

    create(name: string, userIds: string[]) {
        const request = {
            name: name,
            users: userIds
        }
        return this.api.post('/api/chats/', request);
    }

    read(offset: number, limit: number, banned: boolean) {
        return this.api.get(`/api/chats/list/?offset=${offset}&limit=${limit}&filter_banned=${banned}`);
    }

    rename(chatId: string, name: string) {
        const request = {
            chat_id: chatId,
            name: name
        }
        return this.api.patch(`/api/chats/`, request);
    }

    delete(id: string) {
        return this.api.post(`/api/chats/?chat_id=${id}`);
    }

    addParticipant(chatId: string, userId: string) {
        const request = {
            chat_id: chatId,
            user_id: userId
        }
        return this.api.post('/api/chats/', request);
    }

    ban(chatId: string) {
        return this.api.post(`/api/chats/?chat_id=${chatId}`);
    }

    details(chatId: string) {
        return this.api.get(`/api/chats/details/?id=${chatId}`);
    }

}