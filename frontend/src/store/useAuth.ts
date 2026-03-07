import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import api, { setAuthToken } from '@/services/api';
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
    onboardingStatus?: 'none' | 'draft' | 'pending' | 'approved' | 'rejected';
}

const DEMO_USER: User = {
    _id: "demo-user-id",
    name: "Demo Developer",
    email: "dev@example.com",
    role: "admin",
    accessToken: "demo-access-token",
    onboardingStatus: "approved"
};

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
    clearSession: () => void;
    loginAsDev: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuth = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setUser: (user) => {
                set({ user });
                setAuthToken(user?.accessToken || null);

                // Set a non-HttpOnly cookie as a fallback for the middleware
                if (typeof document !== 'undefined') {
                    if (user?.accessToken) {
                        document.cookie = `accessTokenFallback=${user.accessToken}; path=/; max-age=31536000; SameSite=Lax`;
                    } else {
                        document.cookie = 'accessTokenFallback=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    }
                }
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
            clearSession: () => {
                set({ user: null });
                setAuthToken(null);
                if (typeof document !== 'undefined') {
                    document.cookie = 'accessTokenFallback=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                }
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

                // Mark as hydrated
                state?.setHasHydrated(true);
            }
        }
    )
);
