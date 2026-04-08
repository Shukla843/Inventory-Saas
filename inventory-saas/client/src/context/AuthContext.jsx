import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * Auth Context
 * Manages user authentication state across the application
 */
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    // Only check auth if we have an indication user might be logged in
    const hasAuthIndication = localStorage.getItem('authChecked') === 'true';
    if (hasAuthIndication) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('authChecked', 'true');
      }
    } catch (error) {
      // 401 is expected when not authenticated - don't treat as error
      if (error.response?.status === 401) {
        setUser(null);
        localStorage.removeItem('authChecked');
      } else {
        // Only log actual errors (not authentication failures)
        console.error('Auth check failed:', error);
        setUser(null);
        localStorage.removeItem('authChecked');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('authChecked', 'true'); // Mark as potentially authenticated
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Signup user
   */
  const signup = async (name, email, password, role = 'staff') => {
    try {
      setError(null);
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('authChecked', 'true'); // Mark as potentially authenticated
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false, message };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('authChecked'); // Clear auth indication
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
