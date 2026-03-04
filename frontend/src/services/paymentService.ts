import api from './api';

export interface PaymentInitiateResponse {
    transactionId: string;
}

export interface PaymentStatusResponse {
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    transactionId: string;
}

export const paymentService = {
    initiatePayment: async (paymentMethod: string, amount: number): Promise<PaymentInitiateResponse> => {
        const response = await api.post('/payments/initiate', { paymentMethod, amount });
        return response.data.data;
    },

    checkPaymentStatus: async (transactionId: string): Promise<PaymentStatusResponse> => {
        const response = await api.get(`/payments/status/${transactionId}`);
        return response.data.data;
    }
};
