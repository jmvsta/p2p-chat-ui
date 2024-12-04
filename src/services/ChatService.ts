import {api} from './ApiSettingsService';
import {Chat} from "../types";

export default class ChatService {

    private chatsComparator = (first: Chat, second: Chat) =>
        second.last_active.localeCompare(first.last_active);

    create(name: string, userIds: string[]) {
        const request = {
            name: name,
            users: userIds
        }
        return api.post('/api/chats/', request);
    }

    read(offset: bigint, limit: bigint, banned: boolean) {
        return api.get(`/api/chats/list/?offset=${offset}&limit=${limit}&filter_banned=${banned}`);
    }

    delete(id: string) {
        return api.post(`/api/chats/moderate/?id=${id}&action=del`);
    }
}