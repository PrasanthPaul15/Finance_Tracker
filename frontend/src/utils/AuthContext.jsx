import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ft_token'));
  const [loading, setLoading] = useState(true);

  // Set axios default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('ft_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('ft_token');
    }
  }, [token]);

  // On mount, verify token and load user
  useEffect(() => {
    if (token) {
      axios.get(`${BASE_URL}/auth/me`)
        .then(r => setUser(r.data))
        .catch(() => { setToken(null); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    const r = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
    setToken(r.data.access_token);
    setUser(r.data.user);
    return r.data;
  };

  const login = async (email, password) => {
    const r = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    setToken(r.data.access_token);
    setUser(r.data.user);
    return r.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
