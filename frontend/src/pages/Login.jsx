import { useForm } from 'react-hook-form';
import { Box, Button, VStack, Heading, Text, Container,Input,Stack} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { toaster } from "../components/ui/toaster";

const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
      try {
        await login(data);
        toaster.create({
          title: "Login correcto",
          description: "Bienvenido de nuevo",
          type: "success",
        });

      } catch (error) {
        toaster.create({
          title: "Error al iniciar sesión",
          description:
            error?.response?.data?.message ||
            error?.message ||"Credenciales incorrectas",
          type: "error",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box p={8} border="1px solid" borderColor="sand.200" borderRadius="2xl" bg="sand.50">
        <VStack gap={6} align="stretch">
          <Heading textAlign="center" size="lg" color="earth.700">Inicia sesión</Heading>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
              <Box>
                <Text mb={2} fontWeight="bold" fontSize="sm" color="earth.600">Email</Text>
                <Input 
                  type="email" 
                  bg="white"
                  borderColor="sand.300"
                  _focus={{ borderColor: "brand.400" }}
                  {...register('email', { required: 'El email es obligatorio' })} 
                />
                {errors.email && <Text color="red.500" fontSize="xs" mt={1}>{errors.email.message}</Text>}
              </Box>

              <Box>
                <Text mb={2} fontWeight="bold" fontSize="sm" color="earth.600">Contraseña</Text>
                <Input 
                  type="password"
                  bg="white"
                  borderColor="sand.300"
                  _focus={{ borderColor: "brand.400" }}
                  {...register('password', { required: 'La contraseña es obligatoria' })} 
                />
                {errors.password && <Text color="red.500" fontSize="xs" mt={1}>{errors.password.message}</Text>}
              </Box>

              <Button 
                type="submit" 
                colorPalette="brand" 
                width="full" 
                loading={isLoading}
                size="lg"
                mt={2}
              >
                Confirmar
              </Button>
            </Stack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export { Login };