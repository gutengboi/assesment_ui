import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;
    clearError: () => void;
}

interface LoginResponse {
    accessToken: string;
    [key: string]: any;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                   
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });


                    const data: LoginResponse = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Login failed');
                    }

                    set({
                        token: data.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return data;
                } catch (error: any) {
                    set({
                        error: error.message,
                        isLoading: false,
                        isAuthenticated: false,
                        token: null
                    });
                    throw error;
                }
            },

            logout: () => {
                set({
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);