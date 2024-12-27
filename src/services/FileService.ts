import {api} from './ApiSettingsService';

export default class FileService {

    read(messageId: number) {
        return api.post(`/api/downloads/start?msg_id=${messageId}`, messageId);
    }

    create(file: Blob, chatId: string | undefined) {
        const formData = new FormData();
        formData.append('file', file);
        if (chatId) {
            formData.append('chat_id', chatId);
        }
        return api.post(`/api/msgs/file/`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }
}