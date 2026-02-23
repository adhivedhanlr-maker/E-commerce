import api from './api';

export const loginUser = async (credentials: Record<string, string>) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
};

export const registerUser = async (userData: Record<string, string>) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};
