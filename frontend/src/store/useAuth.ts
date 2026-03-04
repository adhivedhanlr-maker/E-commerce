import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import api from '@/services/api';
import { get, set, del } from 'idb-keyval';

// Custom storage using IndexedDB for better "browser cache" persistence
const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    accessToken: string;
}

const DEMO_USER: User = {
    _id: "demo-user-id",
    name: "Demo Developer",
    email: "dev@example.com",
    role: "admin",
    accessToken: "demo-access-token"
};

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
    loginAsDev: () => void;
}

export const useAuth = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => {
                set({ user });
            },
            logout: async () => {
                try {
                    await api.post('/auth/logout');
                } catch {
                    // Ignore errors
                }
                set({ user: null });
            },
            loginAsDev: () => {
                set({ user: DEMO_USER });
            },
        }),
        {
            name: 'auth-storage-v2', // New name to avoid conflicts with old localStorage
            storage: createJSONStorage(() => storage),
            onRehydrateStorage: () => async (state) => {
                // SWR Style: Instant Load + Background Revalidation
                if (state?.user) {
                    api.get('/auth/profile').catch((error: any) => {
                        console.warn('[Auth] Background revalidation failed:', error.message);
                        // Interceptor handles 401, but we can clear state here too if needed
                    });
                }

                // Dev auto-login fallback
                if (process.env.NODE_ENV === 'development' && state && !state.user) {
                    state.loginAsDev();
                }
            }
        }
    )
);
