import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
    _id: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistStore {
    wishlistItems: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            wishlistItems: [],

            addItem: (item) => {
                const { wishlistItems } = get();
                if (!wishlistItems.find((x) => x._id === item._id)) {
                    set({ wishlistItems: [...wishlistItems, item] });
                }
            },

            removeItem: (id) => {
                set({
                    wishlistItems: get().wishlistItems.filter((x) => x._id !== id),
                });
            },

            isInWishlist: (id) => {
                return !!get().wishlistItems.find((x) => x._id === id);
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
