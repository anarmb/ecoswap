import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/authService.js';
import { getMyProfile } from '../services/userService.js';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const userData = await getMyProfile();
          setUser(userData);
        } catch (error) {
          console.error("Invalid session:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const register = async (formData) => {
    try {
      const data = await registerUser(formData);
      const { token, user: userData } = data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const login = async (formData) => {
    try {
      const data = await loginUser(formData);
      const { token, user: userData } = data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      navigate('/');
    } catch (error) {
      console.error("Login error", error);
      throw error.response?.data?.message || 'Error login';
    }
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, loading, register, updateUser
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};