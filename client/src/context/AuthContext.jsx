import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import axiosClient, { setAccessToken } from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt silent refresh on app load using the httpOnly cookie
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axiosClient.post('/auth/refresh');
        if (!cancelled) {
          setAccessToken(data.data.accessToken);
          setUser(data.data.user);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await axiosClient.post('/auth/login', { email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await axiosClient.post('/auth/register', { name, email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(async () => {
    await axiosClient.post('/auth/logout').catch(() => {});
    setAccessToken(null);
    setUser(null);
  }, []);

  // Memoize context value so consumers don't re-render on unrelated parent renders
  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, isAuthenticated: !!user }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}