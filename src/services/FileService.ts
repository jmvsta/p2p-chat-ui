import IService from './IService.ts';

export default class FileService extends IService {

    readAll() {
        return this.api.get('/api/downloads/all');
    }

    read(messageId: number) {
        return this.api.post(`/api/downloads/start?msg_id=${messageId}`);
    }

    stop(messageId: number) {
        return this.api.post(`/api/downloads/stop?msg_id=${messageId}`);
    }

    status(messageId: number) {
        return this.api.get(`/api/downloads/status?msg_id=${messageId}`);
    }
}