import axios, {AxiosInstance} from 'axios';

export default abstract class Service {
    protected api: AxiosInstance = axios.create({
        baseURL: (import.meta as any).env.VITE_API_BASE_URL,
    });
}