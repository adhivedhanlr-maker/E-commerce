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
                setAuthToken(user?.accessToken || null);
            },
            logout: async () => {
                try {
                    await api.post('/auth/logout');
                } catch {
                    // Ignore errors
                }
                set({ user: null });
                setAuthToken(null);
            },
            loginAsDev: () => {
                set({ user: DEMO_USER });
                setAuthToken(DEMO_USER.accessToken);
            },
        }),
        {
            name: 'auth-storage-v2', // New name to avoid conflicts with old localStorage
            storage: createJSONStorage(() => storage),
            onRehydrateStorage: () => async (state) => {
                // Synchronize token on load
                if (state?.user) {
                    setAuthToken(state.user.accessToken);

                    // SWR Style: Background Revalidation
                    api.get('/auth/profile').catch((error: unknown) => {
                        const message = error instanceof Error ? error.message : 'Unknown error';
                        console.warn('[Auth] Background revalidation failed:', message);
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
