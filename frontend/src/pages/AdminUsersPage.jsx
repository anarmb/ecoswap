import { Container, Heading, Box } from "@chakra-ui/react";
import { AdminUsers } from "../components/AdminUsers";

const AdminUsersPage = () => {
  return (
    <Box w="100%" overflowX="hidden">
      <Container maxW="6xl" py={10} px={{ base: 4, md: 8 }}>
        <Box mb={8} p={6} bg="sand.50" borderRadius="xl" borderWidth="1px" borderColor="sand.200">
          <Heading size="xl" mb={2} color="earth.700">Gestión de Usuarios</Heading>
        </Box>
        <AdminUsers />
      </Container>
    </Box>
  );
};

export {AdminUsersPage};