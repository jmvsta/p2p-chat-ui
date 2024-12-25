import axios from 'axios';
import {sha3_512} from 'js-sha3';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default class ApiSettingsService {

    read() {
        return api.get(`/api/settings/status/`);
    }

    create(password: string) {
        return api.post(`/api/settings/init/?pwd=${sha3_512(password)}}`);
    }

}

