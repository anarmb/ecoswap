import { Center, Stack, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Center flex="1" h="60vh" flexDirection="column" bg="sand.50">
      <Stack gap={6} textAlign="center" align="center">
        <Heading size="4xl" color="brand.500">404</Heading>
        <Heading size="lg" color="earth.700">Página no encontrada</Heading>
        <Text color="earth.500">
          La página que buscas no existe o ha sido movida.
        </Text>
        <Stack direction="row" gap={3}>
          <Button colorPalette="brand" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
          <Button variant="outline" colorPalette="earth" onClick={() => navigate(-1)}>
            Volver atrás
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
};

export { NotFound };