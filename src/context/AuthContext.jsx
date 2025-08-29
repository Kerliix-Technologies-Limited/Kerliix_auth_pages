import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Attempt to fetch current user
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        // Access token may be expired → try refreshing
        try {
          await API.get('/auth/refresh-token');
          const res = await API.get('/auth/me');
          setUser(res.data);
        } catch (refreshErr) {
          console.warn('Refresh failed, logging out');
          setUser(null);
        }
      } else {
        console.error('Failed to fetch user:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Login helper — after successful login API call
  const login = (userData) => setUser(userData);

  // Logout
  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easier access
export function useAuth() {
  return useContext(AuthContext);
}
