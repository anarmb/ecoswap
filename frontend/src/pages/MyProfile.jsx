import { Container, Stack, Box, Heading, Text, Avatar, Badge, Separator, Button, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MyProducts } from "../components/MyProducts";
import { UserTransactions } from "../components/UserTransactions";
import { LucidePackage, LucideArrowLeftRight } from "lucide-react";

const MyProfile = () => {
  const { user } = useAuth();

  if (!user) return (
    <Center h="60vh" bg="sand.50">
      <Spinner size="xl" color="brand.500" />
      <Text ml={4} color="earth.500">Cargando perfil...</Text>
    </Center>
  );

  return (
    <Container maxW="4xl" py={10}>
      <Stack gap={10}>
        
        <Box p={8} bg="sand.50" borderRadius="2xl" border="1px solid" borderColor="sand.200">
          <Flex 
            justify="space-between" 
            align="center" 
            direction={{ base: "column", md: "row" }} 
            gap={6}
          >
            <Flex align="center" gap={6} direction={{ base: "column", md: "row" }}>
              <Avatar.Root size="2xl" border="4px solid white" shadow="sm" ring="3px" ringColor="brand.200">
                <Avatar.Image src={user.profile_img} />
                <Avatar.Fallback name={user.name} />
              </Avatar.Root>

              <Stack gap={1} textAlign={{ base: "center", md: "left" }}>
                <Heading size="2xl" letterSpacing="tight" color="earth.800">{user.name}</Heading>
                <Text color="earth.500" fontSize="lg">{user.email}</Text>
                <Badge colorPalette="brand" variant="subtle" width="fit-content" alignSelf={{ base: "center", md: "start" }}>
                  {user.role === "admin" ? "Administrador EcoSwap" : "Usuario EcoSwap"}
                </Badge>
              </Stack>
            </Flex>

            <Button 
              as={RouterLink} 
              to="/edit-profile" 
              variant="outline" 
              colorPalette="brand"
              size="sm"
              borderRadius="full"
            >
              Editar Perfil
            </Button>
          </Flex>
        </Box>

        <Stack gap={4}>
          <Flex align="center" gap={2}>
            <LucideArrowLeftRight size={20} color="var(--chakra-colors-brand-500)" />
            <Heading size="md" color="earth.700">Mis Movimientos (Compras/Ventas)</Heading>
          </Flex>
          <Separator borderColor="sand.200" />
          <Box bg="white" p={1} borderRadius="lg" borderWidth="1px" borderColor="sand.200">
            <UserTransactions />
          </Box>
        </Stack>

        <Stack gap={4}>
          <Flex align="center" gap={2}>
            <LucidePackage size={20} color="var(--chakra-colors-brand-500)" />
            <Heading size="md" color="earth.700">Mis Productos en Venta</Heading>
          </Flex>
          <Separator borderColor="sand.200" />
          <Box>
            <MyProducts />
          </Box>
        </Stack>

      </Stack>
    </Container>
  );
};

export { MyProfile };