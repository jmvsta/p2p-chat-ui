import {sha3_512} from 'js-sha3';
import IService from './IService.ts';

export default class SettingsService extends IService {

    read() {
        return this.api.get(`/api/settings/status/`);
    }

    create(password: string) {
        return this.api.post(`/api/settings/init/?pwd=${sha3_512(password)}`);
    }

    readCurrent() {
        return this.api.get('/api/settings/me/')
    }

    updateCurrent(login: string, picture: Blob) {
        const formData = new FormData();
        formData.append('name', login);
        formData.append('pic', picture);

        return this.api.post('/api/settings/me/', formData);
    }

}

