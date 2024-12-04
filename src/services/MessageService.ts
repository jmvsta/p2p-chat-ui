import {api} from './ApiSettingsService';

export default class MessageService {

    read(chatId: string, offset: bigint, limit: bigint) {
        return api.get(`/api/msgs/chat/?chat_id=${chatId}&offset=${offset}&limit=${limit}`);
    }
    create(chatId: string, text: string) {
        const body = {
            chat_id: chatId,
            text: text,
        };
        return api.post('/api/msgs/text/', JSON.stringify(body));
    }
}