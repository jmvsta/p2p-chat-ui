import Service from './Service';

export default class ServerService extends Service {

    create(key: string) {
        return this.api.post('/api/servers/', key);
    }

    read() {
        return this.api.get('/api/servers/list/')
    }

    delete(id: string) {
        return this.api.delete(`/api/servers/?id=${id}`);
    }
}