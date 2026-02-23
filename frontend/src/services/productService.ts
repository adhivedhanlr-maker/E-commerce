import api from './api';

export const getProducts = async (params: Record<string, string | number | string[]> = {}) => {
    const { data } = await api.get('/products', { params });
    return data;
};

export const getProductById = async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const getCategories = async () => {
    const { data } = await api.get('/categories');
    return data;
};
