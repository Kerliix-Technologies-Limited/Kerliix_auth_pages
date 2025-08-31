// components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../authContext';
import { useLocation } from 'react-router-dom';

const AUTH_LOGIN_URL = 'https://auth.kerliix.com/login';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to auth.kerliix.com with return URL
      const currentUrl = window.location.href; // original URL the user wanted
      const redirectParam = encodeURIComponent(currentUrl);
      window.location.href = `${AUTH_LOGIN_URL}?redirect=${redirectParam}`;
    }
  }, [user, loading, location]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return children;
}