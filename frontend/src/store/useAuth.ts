import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
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
    logout: () => void;
    loginAsDev: () => void;
}

export const useAuth = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => {
                if (user) {
                    localStorage.setItem('accessToken', user.accessToken);
                } else {
                    localStorage.removeItem('accessToken');
                }
                set({ user });
            },
            logout: () => {
                localStorage.removeItem('accessToken');
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
                // Auto-login in development if no user is found after rehydration
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
