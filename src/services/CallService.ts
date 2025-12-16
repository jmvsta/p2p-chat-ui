import IService from './IService.ts';

export default class CallService extends IService {

    read(offset: number, limit: number) {
        return this.api.get(`/api/call/?offset=${offset}&limit=${limit}`);
    }

    create(chatId: string) {
        const body = {
            chat_id: chatId,
            status: "PENDING",
            code: ''
        };
        return this.api.post('/api/call/', JSON.stringify(body));
    }

    updateCall(callId: string, chatId: string, status: string) {
        return this.api.patch(`/api/call/?call_id=${callId}&chat_id=${chatId}`, status);
    }
}