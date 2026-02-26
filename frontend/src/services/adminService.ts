import api from './api';

export const getAllSellers = async (status?: string) => {
    const { data } = await api.get(`/admin/sellers${status ? `?status=${status}` : ''}`);
    return data;
};

export const updateSellerStatus = async (id: string, status: string, remarks?: string) => {
    const { data } = await api.put(`/admin/sellers/${id}/status`, { status, remarks });
    return data;
};
