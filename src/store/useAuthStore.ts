import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserType {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

interface AuthStateType {
    user: UserType | null;
    token: string | null;
    setAuth: (user: UserType, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStateType>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
