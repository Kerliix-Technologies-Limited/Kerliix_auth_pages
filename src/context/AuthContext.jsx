import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user info on mount or refresh
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        // Not logged in — clear user without logging error
        setUser(null);
        // Optionally: console.info('No user logged in');
      } else {
        // Log unexpected errors
        console.error('Failed to fetch user:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login sets user data in context
  const login = (userData) => setUser(userData);

  // Logout calls API and clears user on success
  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally add UI feedback here
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext easily
export function useAuth() {
  return useContext(AuthContext);
}
