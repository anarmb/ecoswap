import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Center, Spinner } from '@chakra-ui/react';

export const ProtectedRoute = ({children}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh" bg="sand.50">
        <Spinner size="xl" color="brand.500" borderWidth="4px" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};