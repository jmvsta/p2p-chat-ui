import IService from './IService.ts';

export default class CallService extends IService {

    read(offset: number, limit: number) {
        return this.api.get(`/api/msgs/call/list/?offset=${offset}&limit=${limit}`);
    }

    create(chatId: string) {
        const call = {
            id: 0,
            chatId: chatId,
            status: "PENDING",
            code: ''
        };
        return this.api.post('/api/msgs/call/', JSON.stringify(call));
    }

    updateCall(callId: number, status: string) {
        return this.api.patch(`/api/msgs/call/?call_id=${callId}`, status);
    }
}