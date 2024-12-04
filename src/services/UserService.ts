import {api} from './ApiSettingsService';
import axios from 'axios';

export default class UserService {

    read() {
        return api.get('/api/users/list')
    }

    readCurrent() {
        return api.get('/api/settings/me')
    }

    readContact() {
        return api.get(`/api/users/my-contact`);
    }

    create(name: string, contact: string) {
        const request = {
            name: name,
            contact: contact
        }
        return axios.post('/api/users/', request);
    }

    update(login: string, picture: Blob) {
        const formData = new FormData();
        formData.append('name', login);
        formData.append('pic', picture);

        return api.post('/api/settings/me/', formData);
    }

}