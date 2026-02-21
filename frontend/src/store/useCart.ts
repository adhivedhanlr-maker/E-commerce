import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    qty: number;
    countInStock: number;
}

interface CartStore {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQty: (id: string, qty: number) => void;
    clearCart: () => void;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            cartItems: [],
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,

            addItem: (item) => {
                const { cartItems } = get();
                const existItem = cartItems.find((x) => x._id === item._id);

                if (existItem) {
                    set({
                        cartItems: cartItems.map((x) =>
                            x._id === existItem._id ? item : x
                        ),
                    });
                } else {
                    set({ cartItems: [...cartItems, item] });
                }
                get().updateTotals();
            },

            removeItem: (id) => {
                set({
                    cartItems: get().cartItems.filter((x) => x._id !== id),
                });
                get().updateTotals();
            },

            updateQty: (id, qty) => {
                set({
                    cartItems: get().cartItems.map((x) =>
                        x._id === id ? { ...x, qty } : x
                    ),
                });
                get().updateTotals();
            },

            clearCart: () => {
                set({ cartItems: [] });
                get().updateTotals();
            },

            updateTotals: () => {
                const { cartItems } = get();
                const itemsPrice = cartItems.reduce(
                    (acc, item) => acc + item.price * item.qty,
                    0
                );
                const shippingPrice = itemsPrice > 100 ? 0 : 10;
                const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
                const totalPrice = itemsPrice + shippingPrice + taxPrice;

                set({ itemsPrice, shippingPrice, taxPrice, totalPrice });
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
