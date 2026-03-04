'use client';

import { useEffect } from 'react';

const CURRENT_CART_VERSION = 2;
const CART_VERSION_KEY = 'cart-storage-version';
const CART_STORAGE_KEY = 'cart-storage';

/**
 * Runs once on app startup to clear any stale cart data that contains
 * invalid product IDs (e.g. Math.random() strings from old dev code).
 */
export default function CartCleaner() {
    useEffect(() => {
        try {
            const storedVersion = parseInt(localStorage.getItem(CART_VERSION_KEY) || '0', 10);

            if (storedVersion < CURRENT_CART_VERSION) {
                // Nuke the old cart storage completely
                localStorage.removeItem(CART_STORAGE_KEY);
                localStorage.setItem(CART_VERSION_KEY, String(CURRENT_CART_VERSION));
                console.log('[CartCleaner] Stale cart data cleared (version upgrade).');
            } else {
                // Even if version is current, filter out any remaining invalid items
                const raw = localStorage.getItem(CART_STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed?.state?.cartItems) {
                        const before = parsed.state.cartItems.length;
                        parsed.state.cartItems = parsed.state.cartItems.filter(
                            (item: { _id: string }) => /^[0-9a-fA-F]{24}$/.test(item._id)
                        );
                        if (parsed.state.cartItems.length < before) {
                            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(parsed));
                            console.log(`[CartCleaner] Purged ${before - parsed.state.cartItems.length} invalid cart item(s).`);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[CartCleaner] Failed to clean cart storage:', e);
        }
    }, []);

    return null;
}
