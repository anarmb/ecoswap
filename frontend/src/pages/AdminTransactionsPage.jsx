import { Container, Heading, Box, Text } from "@chakra-ui/react";
import { AdminTransactions } from "../components/AdminTransactions";

const AdminTransactionsPage = () => {
  return (
    <Box w="100%" overflowX="hidden">
      <Container maxW="6xl" py={10} px={{ base: 4, md: 8 }}>
        <Box mb={8} p={6} bg="sand.50" borderRadius="xl" borderWidth="1px" borderColor="sand.200">
          <Heading size="xl" mb={2} color="earth.700">Historial Global de Transacciones</Heading>
          <Text color="earth.500">Registro completo de todas las compras y ventas en EcoSwap.</Text>
        </Box>
        <AdminTransactions />
      </Container>
    </Box>
  );
};

export { AdminTransactionsPage };