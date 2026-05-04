import { Box, Container, SimpleGrid, Stack, Text, Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box as="footer" bg="sand.50" color="earth.700" borderTopWidth="1px" borderColor="sand.200" mt="auto" w="100%" overflowX="hidden">
      <Container maxW="7xl" py={10} px={{ base: 6, md: 10 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
          
          <Stack gap={4} align="center" textAlign="center">
            <Heading size="md" color="brand.600">EcoSwap</Heading>
            <Text fontSize="sm" color="earth.600" maxW="220px">
              Dando una segunda vida a tus objetos favoritos. Únete a la revolución del consumo responsable.
            </Text>
          </Stack>

          <Stack gap={4} align="center" textAlign="center">
            <Text fontWeight="bold" color="earth.700">Explorar</Text>
            <Link as={RouterLink} to="/" variant="plain" fontSize="sm" color="earth.600" _hover={{ color: "brand.500" }}>
              Todos los productos
            </Link>
            <Link as={RouterLink} to="/upload" variant="plain" fontSize="sm" color="earth.600" _hover={{ color: "brand.500" }}>
              Vender algo
            </Link>
          </Stack>

          <Stack gap={4} align="center" textAlign="center">
            <Text fontWeight="bold" color="earth.700">Legal</Text>
            <Link as={RouterLink} to="/privacidad" variant="plain" fontSize="sm" color="earth.600" _hover={{ color: "brand.500" }}>
              Privacidad
            </Link>
            <Link as={RouterLink} to="/terminos" variant="plain" fontSize="sm" color="earth.600" _hover={{ color: "brand.500" }}>
              Términos y condiciones
            </Link>
          </Stack>

        </SimpleGrid>

        <Box borderTopWidth="1px" borderColor="sand.200" mt={10} pt={6} textAlign="center">
          <Text fontSize="xs" color="earth.500">
            © {new Date().getFullYear()} EcoSwap. Hecho con 🌿 para un planeta mejor. Consumo responsable.
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export {Footer};