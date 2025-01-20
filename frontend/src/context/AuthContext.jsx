import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved auth data on mount
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setUser(authData.user);
      setToken(authData.token);
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post('/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('auth', JSON.stringify(data));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/register', userData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('auth', JSON.stringify(data));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        login, 
        logout, 
        register,
        isAuthenticated: !!token 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 