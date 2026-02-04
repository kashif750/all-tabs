import api from '../api/axios';

export const authService = {
    signup: async (data: any) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },
    signin: async (data: any) => {
        const response = await api.post('/auth/signin', data);
        return response.data;
    },
};
