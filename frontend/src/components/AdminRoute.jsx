import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Center, Spinner } from "@chakra-ui/react";

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};