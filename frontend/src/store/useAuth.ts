import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
}

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
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
        }),
        {
            name: 'auth-storage',
        }
    )
);
