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
    updateTotals: () => void;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
}

const isValidObjectId = (id: string) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            cartItems: [],
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,

            addItem: (item) => {
                // Hard reject items with invalid MongoDB ObjectIds
                if (!isValidObjectId(item._id)) {
                    console.error(`[Cart] Rejected item with invalid product ID: "${item._id}"`);
                    return;
                }
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
            version: 2, // <-- bumped version forces Zustand to discard old stale cart data
            migrate: () => {
                // On version upgrade, start with a clean empty cart
                console.log('[Cart] Storage version upgraded — clearing stale cart data');
                return { cartItems: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 };
            },
            merge: (persistedState: unknown, currentState: CartStore) => {
                const typedPersistedState = persistedState as { cartItems?: CartItem[] } | undefined;
                if (typedPersistedState && typedPersistedState.cartItems) {
                    // Filter out any items that don't have a valid MongoDB ObjectId
                    const validItems = typedPersistedState.cartItems.filter((item: CartItem) => {
                        const valid = isValidObjectId(item._id);
                        if (!valid) {
                            console.warn(`[Cart] Purged invalid cart item on hydration: ID="${item._id}", name="${item.name}"`);
                        }
                        return valid;
                    });
                    return { ...currentState, ...(typedPersistedState as Partial<CartStore>), cartItems: validItems };
                }
                return { ...currentState, ...(persistedState as Partial<CartStore>) };
            }
        }
    )
);
