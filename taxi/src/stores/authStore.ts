import { create } from 'zustand'

interface authType{
    accessTk: string | null;
    setAccessToken: (newAccessTk: string | null) => void;
    clearToken: () => void;
}

export const useAuth = create<authType>((set) => ({
    accessTk: null,
    setAccessToken: (newAccessTk) => set({ accessTk: newAccessTk }),
    clearToken: () => set({accessTk: null})
}))