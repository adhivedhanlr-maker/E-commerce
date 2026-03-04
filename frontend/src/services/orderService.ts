import api from './api';

export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
    _id: string;
}

export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderInput {
    orderItems: {
        name: string;
        qty: number;
        image: string;
        price: number;
        product: string;
    }[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
}

export const orderService = {
    // Get logged in user orders
    getMyOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders/myorders');
        return response.data.data;
    },

    // Get order details by ID
    getOrderById: async (id: string): Promise<Order> => {
        const response = await api.get(`/orders/${id}`);
        return response.data.data;
    },

    // Create a new order
    createOrder: async (order: CreateOrderInput): Promise<Order> => {
        const response = await api.post('/orders', order);
        return response.data.data;
    },

    // Update order to paid
    payOrder: async (orderId: string, paymentResult: any): Promise<Order> => {
        const response = await api.put(`/orders/${orderId}/pay`, paymentResult);
        return response.data.data;
    }
};
