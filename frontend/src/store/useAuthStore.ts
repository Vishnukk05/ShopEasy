import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoginModalOpen: boolean;
  authModalMode: 'login' | 'register';
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoginModalOpen: (isOpen: boolean) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoginModalOpen: false,
  authModalMode: 'login',
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isLoginModalOpen: false });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  setLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),
  openAuthModal: (mode) => set({ isLoginModalOpen: true, authModalMode: mode }),
}));

