import {api} from './ApiSettingsService';
import {Chat} from "../types";

export const chatsComparator = (first: Chat, second: Chat) =>
    first.last_active.localeCompare(second.last_active);

export default class ChatService {

    create(name: string, userIds: string[]) {
        const request = {
            name: name,
            users: userIds
        }
        return api.post('/api/chats/', request);
    }

    read(offset: number, limit: number, banned: boolean) {
        return api.get(`/api/chats/list/?offset=${offset}&limit=${limit}&filter_banned=${banned}`);
    }

    delete(id: string | undefined) {
        return api.post(`/api/chats/moderate/?id=${id}&action=del`);
    }
}