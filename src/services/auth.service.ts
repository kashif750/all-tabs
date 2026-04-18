import api from '../api/axios';


export type SignUpAPITypes = {
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string,
};
export type SignInAPITypes = {
    username: string,
    password: string,
};

export const authService = {
    signup: async (data: SignUpAPITypes) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },
    signin: async (data: SignInAPITypes) => {
        const response = await api.post('/auth/signin', data);
        return response.data;
    },
};
