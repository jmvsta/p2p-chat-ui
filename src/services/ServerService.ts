import {api} from './ApiSettingsService';

export default class ServerService {

    create(key: string) {
        return api.post('/api/servers/', key);
    }

    read() {
        return api.get('/api/servers/list')
    }
}