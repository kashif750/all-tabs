import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { BE_BASE_URL } from '../config/keys';

const api = axios.create({
    baseURL: BE_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
