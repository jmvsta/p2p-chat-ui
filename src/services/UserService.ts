import Service from './Service';

export default class UserService extends Service {

    read() {
        return this.api.get('/api/users/list/')
    }

    delete(id: string) {
        return this.api.delete(`/api/users/id=${id}`)
    }

    readContact() {
        return this.api.get(`/api/users/my-contact/`);
    }

    create(name: string, contact: string) {
        const request = {
            name: name,
            contact: contact
        }
        return this.api.post('/api/users/', request);
    }

    update(id: number, name: string, status: string) {
        const request = {
            id: id,
            name: name,
            status: status
        }
        return this.api.patch('/api/users/', request);
    }

    details(id: number) {
        return this.api.get(`/api/users/${id}`);
    }

    decode(key: string) {
        return this.api.post(`/api/users/decode`, key);
    }

}