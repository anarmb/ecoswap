import { Container, Heading, Text, Stack, Box, Separator } from "@chakra-ui/react";

const Terms = () => {
  return (
    <Container maxW="3xl" py={10}>
      <Stack gap={6} bg="white" p={8} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="sand.200">
        <Heading size="xl" color="brand.600" textAlign="center">
          Términos y Condiciones de Uso
        </Heading>
        <Text textAlign="center" color="earth.500" fontSize="sm">
          Última actualización: Abril de 2026
        </Text>

        <Separator borderColor="sand.200" />

        <Box>
          <Heading size="md" color="earth.700" mb={2}>1. Introducción</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            Bienvenido a EcoSwap. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones. EcoSwap actúa como un intermediario tecnológico que facilita el intercambio y la compraventa de artículos de segunda mano para fomentar la economía circular.
          </Text>
        </Box>

        <Box>
          <Heading size="md" color="earth.700" mb={2}>2. Responsabilidad de los Usuarios</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            Los usuarios son los únicos responsables del contenido que publican, incluyendo la exactitud de las descripciones, los precios y las imágenes de los productos. EcoSwap no garantiza la calidad, seguridad o legalidad de los artículos anunciados, ni la veracidad de los usuarios.
          </Text>
        </Box>

        <Box>
          <Heading size="md" color="earth.700" mb={2}>3. Transacciones y Pagos</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            La plataforma facilita el encuentro entre compradores y vendedores. El estado de la transacción ("Pendiente", "Completado", "Cancelado") se gestiona a través de la web para asegurar la transparencia. EcoSwap se reserva el derecho de intervenir a través de un Administrador en caso de disputas.
          </Text>
        </Box>

        <Box>
          <Heading size="md" color="earth.700" mb={2}>4. Cálculo de Huella de Carbono (CO2)</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            El sistema de cálculo de "CO2 Ahorrado" es una estimación gamificada diseñada para concienciar sobre el impacto medioambiental positivo de la reutilización. No representa una certificación oficial ni un valor científico exacto aplicable a normativas de emisiones.
          </Text>
        </Box>

        <Box>
          <Heading size="md" color="earth.700" mb={2}>5. Suspensión de Cuentas</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            Los Administradores de EcoSwap se reservan el derecho de suspender, bloquear o eliminar cuentas de usuarios que violen estos términos, publiquen artículos prohibidos u ofrezcan comportamientos fraudulentos.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
};

export { Terms };