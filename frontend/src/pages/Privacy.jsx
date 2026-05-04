import { Container, Heading, Text, Stack, Box, Separator } from "@chakra-ui/react";

const Privacy = () => {
  return (
    <Container maxW="3xl" py={10}>
      <Stack gap={6} bg="white" p={8} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="sand.200">
        <Heading size="xl" color="brand.600" textAlign="center">
          Política de Privacidad
        </Heading>
        <Text textAlign="center" color="earth.500" fontSize="sm">
          Última actualización: Abril de 2026
        </Text>

        <Separator borderColor="sand.200" />

        <Box>
          <Heading size="md" color="earth.700" mb={2}>1. Recopilación de Datos</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            En EcoSwap recopilamos la información estrictamente necesaria para ofrecer nuestro servicio. Esto incluye tu nombre, dirección de correo electrónico, contraseña (encriptada de forma segura), imagen de perfil y los datos de las transacciones y productos que publiques.
          </Text>
        </Box>

        <Box>
          <Heading size="md" color="earth.700" mb={2}>2. Uso de la Información</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall" mb={2}>
            Utilizamos tus datos exclusivamente para:
          </Text>
          <Box as="ul" color="earth.600" fontSize="sm" pl={6} style={{ listStyleType: 'disc' }}>
            <Box as="li" mb={2}>Gestionar tu cuenta y permitirte acceder a la plataforma.</Box>
            <Box as="li" mb={2}>Facilitar las transacciones entre compradores y vendedores.</Box>
            <Box as="li" mb={2}>Calcular y mostrar tus estadísticas de impacto ambiental (Kg de CO2 ahorrados).</Box>
            <Box as="li">Garantizar la seguridad del entorno mediante la moderación de los administradores.</Box>
          </Box>
        </Box>

        <Box>
          <Heading size="md" color="earth.700" mb={2}>3. Compartición de Datos</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            EcoSwap no vende, alquila ni cede tus datos personales a terceros con fines comerciales. Durante una transacción, el comprador y el vendedor tendrán acceso limitado a la información del otro con el único fin de completar el intercambio.
          </Text>
        </Box>

        <Box>
          <Heading size="md" color="earth.700" mb={2}>4. Tus Derechos</Heading>
          <Text color="earth.600" fontSize="sm" lineHeight="tall">
            Como usuario, tienes derecho a acceder, rectificar o eliminar tu información personal en cualquier momento. Puedes gestionar tu perfil directamente desde la pestaña "Mi Perfil" o "Editar Perfil", así como solicitar la eliminación definitiva de tu cuenta y datos asociados a un Administrador.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
};

export { Privacy };