import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export function useAuth() {
  const [user, setUser]       = useState(() => JSON.parse(localStorage.getItem('at_user') || 'null'));
  const [token, setToken]     = useState(() => localStorage.getItem('at_token') || null);
  const [loading, setLoading] = useState(false);

  const login = useCallback((userData, tok) => {
    localStorage.setItem('at_user', JSON.stringify(userData));
    localStorage.setItem('at_token', tok);
    setUser(userData);
    setToken(tok);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('at_user');
    localStorage.removeItem('at_token');
    setUser(null);
    setToken(null);
  }, []);

  // Refresh user from API on mount (validates stored token)
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    authAPI.me()
      .then(res => {
        const u = res.data;
        localStorage.setItem('at_user', JSON.stringify(u));
        setUser(u);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  return { user, token, loading, login, logout, isAuthenticated: !!user };
}
