import { useState } from "react";
import { Container, Stack, Heading, Input, Button, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Field } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profileImg, setProfileImg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImg(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setProfileImg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("password", formData.password);
      if (profileImg) data.append("profile_img", profileImg);

      await register(data);

      toaster.create({
        title: "¡Bienvenido/a a EcoSwap!",
        description: "Tu cuenta ha sido creada correctamente.",
        type: "success",
        duration: 3000,
      });

      resetForm();
      navigate("/");
    } catch (error) {
      toaster.create({
        title: "Error al registrarse",
        description: error?.message || "Revisa los campos e inténtalo de nuevo.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={20}>
      <Stack gap={8} as="form" onSubmit={handleSubmit}>
        <Stack gap={2} textAlign="center">
          <Heading size="2xl" color="brand.600">Únete a EcoSwap</Heading>
          <Text color="earth.500">Crea tu cuenta y empieza a dar segundas vidas.</Text>
        </Stack>

        <Stack gap={4} p={8} bg="sand.50" borderRadius="2xl" borderWidth="1px" borderColor="sand.200">
          <Field.Root required>
            <Field.Label color="earth.600">Nombre completo</Field.Label>
            <Input name="name" value={formData.name} placeholder="Tu nombre" onChange={handleChange} bg="white" borderColor="sand.300" _focus={{ borderColor: "brand.400" }} />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="earth.600">Email</Field.Label>
            <Input name="email" value={formData.email} type="email" placeholder="correo@ejemplo.com" onChange={handleChange} bg="white" borderColor="sand.300" _focus={{ borderColor: "brand.400" }} />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="earth.600">Contraseña</Field.Label>
            <Input name="password" value={formData.password} type="password" placeholder="********" onChange={handleChange} bg="white" borderColor="sand.300" _focus={{ borderColor: "brand.400" }} />
          </Field.Root>

          <Field.Root>
            <Field.Label color="earth.600">Foto de perfil</Field.Label>
            <Box border="2px dashed" borderColor="sand.300" p={4} borderRadius="md" bg="white">
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </Box>
          </Field.Root>

          <Button type="submit" colorPalette="brand" size="lg" loading={loading} mt={2}>
            Registrarse
          </Button>
        </Stack>

        <Text textAlign="center" fontSize="sm" color="earth.500">
          ¿Ya tienes cuenta?{" "}
          <Link as={RouterLink} to="/login" color="brand.600" fontWeight="bold">
            Inicia sesión aquí
          </Link>
        </Text>
      </Stack>
    </Container>
  );
};

export { Register };