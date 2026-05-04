import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth needs to be used in AuthProvider");
  }
  return context;
};

export {useAuth}; 