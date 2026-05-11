import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { mockUser } from '@/mocks/data';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { email: string; password: string; first_name: string; last_name: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('edifia_token') !== null);
  const [user, setUser] = useState<User | null>(() => { const s = localStorage.getItem('edifia_user'); return s ? JSON.parse(s) : null; });

  const login = useCallback(async (_email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    const token = 'mock_jwt_' + Date.now();
    localStorage.setItem('edifia_token', token);
    localStorage.setItem('edifia_user', JSON.stringify(mockUser));
    setIsAuthenticated(true); setUser(mockUser); return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('edifia_token'); localStorage.removeItem('edifia_user');
    setIsAuthenticated(false); setUser(null);
  }, []);

  const register = useCallback(async (data: { email: string; password: string; first_name: string; last_name: string }): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    const newUser: User = { id: String(Date.now()), email: data.email, first_name: data.first_name, last_name: data.last_name, role: 'owner', is_verified: true, created_at: new Date().toISOString() };
    const token = 'mock_jwt_' + Date.now();
    localStorage.setItem('edifia_token', token); localStorage.setItem('edifia_user', JSON.stringify(newUser));
    setIsAuthenticated(true); setUser(newUser); return true;
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
