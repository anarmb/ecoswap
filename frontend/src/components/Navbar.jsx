import { useState } from 'react';
import { Box, Flex, Button, Heading, Stack, Text, Avatar, Input, MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LucideSearch, LucideShieldCheck, LucideUsers, LucideTag, LucideArrowLeftRight, LucideMenu, LucideUser } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${query}`);
      setQuery("");
    } else {
      navigate("/");
    }
  };

  return (
    <Box as="header" px={{ base: 4, md: 8 }} shadow="sm" bg="brand.600" borderBottomWidth="1px" borderColor="brand.700" position="sticky" top="0" zIndex="1000">
      <Flex h={16} alignItems="center" justifyContent="space-between" gap={3}>

        <Heading size="md" flexShrink={0}>
          <RouterLink to="/">
            <Flex align="center" gap={2}>
              <Box bg="white" color="brand.600" borderRadius="md" px={2} py={1} fontWeight="black" fontSize="sm" letterSpacing="tight">
                ECO
              </Box>
              <Text color="white" fontWeight="bold" letterSpacing="wide">SWAP</Text>
            </Flex>
          </RouterLink>
        </Heading>

        <Box as="form" onSubmit={handleSearch} flex="1" maxW={{ base: "100%", md: "400px" }} position="relative" display={{ base: "none", md: "block" }}>
          <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" zIndex="1" color="brand.200">
            <LucideSearch size={16} />
          </Box>
          <Input
            placeholder="¿Qué estás buscando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            borderRadius="full"
            bg="brand.700"
            color="white"
            size="sm"
            pl="10"
            variant="subtle"
            border="1px solid"
            borderColor="brand.500"
            _placeholder={{ color: "brand.200" }}
            _focus={{ bg: "brand.800", borderColor: "white" }}
          />
        </Box>

        {/* DESKTOP */}
        <Flex display={{ base: "none", md: "flex" }} alignItems="center">
          <Stack direction="row" gap={3} align="center">
            {user?.role === "admin" && (
              <MenuRoot lazyMount unmountOnExit>
                <MenuTrigger asChild>
                  <Button variant="ghost" size="sm" color="white" _hover={{ bg: "brand.700" }} gap={2}>
                    <LucideShieldCheck size={18} />
                    <Text>Admin</Text>
                  </Button>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent bg="white" shadow="lg" borderRadius="xl" borderWidth="1px" borderColor="sand.200" minW="180px">
                    <MenuItem value="users" onClick={() => navigate("/admin/users")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                      <LucideUsers size={16} /> Usuarios
                    </MenuItem>
                    <MenuItem value="categories" onClick={() => navigate("/admin/categories")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                      <LucideTag size={16} /> Categorías
                    </MenuItem>
                    <MenuItem value="transactions" onClick={() => navigate("/admin/transactions")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                      <LucideArrowLeftRight size={16} /> Transacciones
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            )}

            {user ? (
              <>
                <Button colorPalette="white" variant="outline" as={RouterLink} to="/upload" size="sm" color="white" borderColor="white" _hover={{ bg: "brand.700" }}>
                  Vender
                </Button>
                <RouterLink to="/profile">
                  <Avatar.Root size="sm" cursor="pointer" _hover={{ opacity: 0.8 }} ring="2px" ringColor="brand.300">
                    <Avatar.Image src={user.profile_img} />
                    <Avatar.Fallback name={user.name} />
                  </Avatar.Root>
                </RouterLink>
                <Button onClick={logout} variant="ghost" size="sm" color="brand.100" _hover={{ bg: "brand.700", color: "white" }}>
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button as={RouterLink} to="/login" variant="ghost" size="sm" color="white" _hover={{ bg: "brand.700" }}>
                  Iniciar sesión
                </Button>
                <Button as={RouterLink} to="/register" variant="solid" size="sm" bg="white" color="brand.600" _hover={{ bg: "brand.50" }}>
                  Registro
                </Button>
              </>
            )}
          </Stack>
        </Flex>

        <Flex display={{ base: "flex", md: "none" }} gap={2} align="center">
          {user ? (
            <>
              {user.role === "admin" && (
                <MenuRoot lazyMount unmountOnExit>
                  <MenuTrigger asChild>
                    <Button variant="ghost" size="sm" color="white" _hover={{ bg: "brand.700" }}>
                      <LucideShieldCheck size={20} />
                    </Button>
                  </MenuTrigger>
                  <MenuPositioner>
                    <MenuContent bg="white" shadow="lg" borderRadius="xl" borderWidth="1px" borderColor="sand.200" minW="180px">
                      <MenuItem value="users" onClick={() => navigate("/admin/users")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                        <LucideUsers size={16} /> Usuarios
                      </MenuItem>
                      <MenuItem value="categories" onClick={() => navigate("/admin/categories")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                        <LucideTag size={16} /> Categorías
                      </MenuItem>
                      <MenuItem value="transactions" onClick={() => navigate("/admin/transactions")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                        <LucideArrowLeftRight size={16} /> Transacciones
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </MenuRoot>
              )}

              <MenuRoot lazyMount unmountOnExit>
                <MenuTrigger asChild>
                  <Button variant="ghost" size="sm" color="white" _hover={{ bg: "brand.700" }}>
                    <LucideMenu size={22} />
                  </Button>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent bg="white" shadow="lg" borderRadius="xl" borderWidth="1px" borderColor="sand.200" minW="180px">
                    <MenuItem value="profile" onClick={() => navigate("/profile")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                      <LucideUser size={16} /> Mi perfil
                    </MenuItem>
                    <MenuItem value="upload" onClick={() => navigate("/upload")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                      Vender
                    </MenuItem>
                    <MenuItem value="logout" onClick={logout} gap={3} _hover={{ bg: "red.50" }} borderRadius="lg" color="red.500">
                      Salir
                    </MenuItem>
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            </>
          ) : (
            <MenuRoot lazyMount unmountOnExit>
              <MenuTrigger asChild>
                <Button variant="ghost" size="sm" color="white" _hover={{ bg: "brand.700" }}>
                  <LucideMenu size={22} />
                </Button>
              </MenuTrigger>
              <MenuPositioner>
                <MenuContent bg="white" shadow="lg" borderRadius="xl" borderWidth="1px" borderColor="sand.200" minW="180px">
                  <MenuItem value="login" onClick={() => navigate("/login")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                    Iniciar sesión
                  </MenuItem>
                  <MenuItem value="register" onClick={() => navigate("/register")} gap={3} _hover={{ bg: "sand.50" }} borderRadius="lg">
                    Registro
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          )}
        </Flex>

      </Flex>
    </Box>
  );
};

export { Navbar };