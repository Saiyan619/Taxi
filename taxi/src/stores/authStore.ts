import { create } from 'zustand'

interface authType{
    accessTk: string | null;
    isAuthLoading: boolean;
    isAuthenticated: boolean;
    setAccessToken: (newAccessTk: string | null) => void;
    clearToken: () => void;
    setIsAuthLoading: (value: boolean) => void;
    setIsAuthenticated: (value: boolean) => void;
}

export const useAuth = create<authType>((set) => ({
    accessTk: null,
    isAuthLoading: true,
    isAuthenticated: false,
    setAccessToken: (newAccessTk) => set({ accessTk: newAccessTk }),
    clearToken: () => set({accessTk: null}),
    setIsAuthLoading: (value: boolean) => set({ isAuthLoading: value }),
    setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value })
}))