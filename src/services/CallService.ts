import IService from './IService.ts';
import {Call} from "../types";

export default class CallService extends IService {

    read(offset: number, limit: number) {
        return this.api.get(`/api/call/?offset=${offset}&limit=${limit}`);
    }

    create(chatId: string) {
        const call: Call = {
            id: 0,
            chatId: chatId,
            status: "PENDING",
            code: ''
        };
        return this.api.post('/api/call/', JSON.stringify(call));
    }

    updateCall(callId: string, chatId: string, status: string) {
        return this.api.patch(`/api/call/?call_id=${callId}&chat_id=${chatId}`, status);
    }
}