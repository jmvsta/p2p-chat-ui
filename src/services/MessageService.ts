import Service from './Service';

export default class MessageService extends Service {

    read(chatId: string, offset: number, limit: number) {
        return this.api.get(`/api/msgs/chat/?chat_id=${chatId}&offset=${offset}&limit=${limit}`);
    }

    create(chatId: string, text: string) {
        const body = {
            chat_id: chatId,
            text: text,
        };
        return this.api.post('/api/msgs/text/', JSON.stringify(body));
    }

    createFile(chatId: string, file: Blob) {
        const body = {
            chat_id: chatId,
            file: file,
        };
        return this.api.post('/api/msgs/file/', JSON.stringify(body));
    }

    delete(msgId: string) {
        return this.api.delete(`/api/msgs/chat/?msg_id=${msgId}`);
    }
}