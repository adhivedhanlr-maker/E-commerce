import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

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
                if (user) {
                    // Also store in localStorage as fallback for non-cookie environments
                    localStorage.setItem('accessToken', user.accessToken);
                } else {
                    localStorage.removeItem('accessToken');
                }
                set({ user });
            },
            logout: async () => {
                try {
                    // Tell backend to clear the HTTP-only cookie
                    await api.post('/auth/logout');
                } catch {
                    // Ignore errors — clear local state regardless
                }
                localStorage.removeItem('accessToken');
                localStorage.removeItem('auth-storage');
                set({ user: null });
            },
            loginAsDev: () => {
                set({ user: DEMO_USER });
                localStorage.setItem('accessToken', DEMO_USER.accessToken);
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                if (
                    process.env.NODE_ENV === 'development' &&
                    state &&
                    !state.user
                ) {
                    state.loginAsDev();
                }
            }
        }
    )
);
