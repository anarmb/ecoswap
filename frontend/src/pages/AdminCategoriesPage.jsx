import { Container, Heading, Box, Text} from "@chakra-ui/react";
import { AdminCategories } from "../components/AdminCategories";

const AdminCategoriesPage = () => {
  return (
    <Container maxW="5xl" py={10}>
      <Box mb={8} p={6} bg="sand.50" borderRadius="xl" borderWidth="1px" borderColor="sand.200">
        <Heading size="xl" mb={2} color="earth.700">Gestión de Categorías</Heading>
        <Text color="earth.500">Administra las categorías que los usuarios usan para sus productos.</Text>
      </Box>
      <AdminCategories />
    </Container>
  );
};

export {AdminCategoriesPage};