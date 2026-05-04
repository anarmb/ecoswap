import { useState } from "react";
import { Container, Stack, Heading, Input, Button, Box, Avatar, Field, Center, Separator, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, deleteUser, changePassword } from "../services/userService";
import { toaster } from "../components/ui/toaster";
import { ConfirmDialog } from "../components/ConfirmDialog";

const EditProfile = () => {
  const { user, updateUser, logout } = useAuth(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [newImage, setNewImage] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("email", formData.email.trim());
    if (newImage && newImage instanceof File) {
      data.append("profile_img", newImage);
    }

    try {
      const updatedUser = await updateProfile(data);
      updateUser(updatedUser); 
      toaster.create({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",        
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Error al actualizar",
        description: error?.message || "Revisa los campos",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toaster.create({
        title: "Las contraseñas no coinciden",
        description: "La nueva contraseña y la confirmación deben ser iguales",
        type: "error",
      });
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toaster.create({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada correctamente",
        type: "success",
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toaster.create({
        title: "Error al cambiar la contraseña",
        description: error.response?.data?.message || "Revisa los campos",
        type: "error",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(user._id);
      toaster.create({
        title: "Cuenta eliminada",
        description: "Cuenta y productos eliminados con éxito",
        type: "success",
      });
      setTimeout(() => {
        logout();
        navigate("/");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/");
      } else {
        toaster.create({
          title: "Error al eliminar la cuenta",
          description: error?.message || "Hubo un problema al intentar eliminar la cuenta",
          type: "error",
        });
      }
    } finally {
      setDeleteStep(0);
    }
  };

  const deleteDialogContent = {
    1: {
      title: "Eliminar cuenta",
      description: "¿Estás seguro de que quieres borrar tu cuenta? Esta acción es irreversible.",
    },
    2: {
      title: "Confirmación final",
      description: "Se eliminarán todos tus productos y fotos de EcoSwap. ¿SEGURO QUE QUIERES CONTINUAR?",
    },
  };

  return (
    <Container maxW="md" py={10}>
      <Stack gap={8}>

        <Stack gap={8} as="form" onSubmit={handleSubmit}>
          <Heading size="xl" textAlign="center" color="earth.700">Editar Perfil</Heading>
          
          <Center flexDirection="column" gap={4}>
            <Avatar.Root size="2xl" ring="3px" ringColor="brand.200">
              <Avatar.Image src={newImage ? URL.createObjectURL(newImage) : user?.profile_img} />
              <Avatar.Fallback name={user?.name} />
            </Avatar.Root>
            <input 
              type="file" 
              accept="image/*" 
              id="avatar-input" 
              hidden 
              onChange={(e) => setNewImage(e.target.files[0])} 
            />
            <Button variant="outline" colorPalette="brand" size="sm" onClick={() => document.getElementById('avatar-input').click()}>
              Cambiar foto
            </Button>
          </Center>

          <Stack gap={4} p={6} bg="sand.50" borderRadius="2xl" borderWidth="1px" borderColor="sand.200">
            <Field.Root>
              <Field.Label color="earth.600">Nombre completo</Field.Label>
              <Input name="name" value={formData.name} onChange={handleChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
            </Field.Root>

            <Field.Root>
              <Field.Label color="earth.600">Email</Field.Label>
              <Input name="email" value={formData.email} onChange={handleChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
            </Field.Root>

            <Button type="submit" colorPalette="brand" size="lg" loading={loading} mt={2}>
              Guardar cambios
            </Button>
            
            <Button variant="ghost" color="earth.500" onClick={() => navigate("/profile")}>
              Cancelar
            </Button>
          </Stack>
        </Stack>

        <Separator borderColor="sand.200" />

        <Stack gap={8} as="form" onSubmit={handleChangePassword}>
          <Heading size="md" textAlign="center" color="earth.700">Cambiar contraseña</Heading>
          <Stack gap={4} p={6} bg="sand.50" borderRadius="2xl" borderWidth="1px" borderColor="sand.200">
            <Field.Root>
              <Field.Label color="earth.600">Contraseña actual</Field.Label>
              <Input name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
            </Field.Root>
            <Field.Root>
              <Field.Label color="earth.600">Nueva contraseña</Field.Label>
              <Input name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
            </Field.Root>
            <Field.Root>
              <Field.Label color="earth.600">Confirmar nueva contraseña</Field.Label>
              <Input name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
            </Field.Root>
            <Button type="submit" variant="outline" colorPalette="brand" size="lg">
              Cambiar contraseña
            </Button>
          </Stack>
        </Stack>

        <Separator borderColor="sand.200" />
        
        <Box p={6} border="1px solid" borderColor="red.100" borderRadius="xl" bg="red.50/30">
          <Text fontSize="xs" color="earth.500" mb={4}>
            Una vez elimines tu cuenta, todos tus datos y productos desaparecerán para siempre de nuestra plataforma.
          </Text>
          <Button 
            size="sm" 
            variant="ghost" 
            colorPalette="red" 
            width="full"
            onClick={() => setDeleteStep(1)}
          >
            Eliminar cuenta permanentemente
          </Button>
        </Box>

      </Stack>

      <ConfirmDialog
        isOpen={deleteStep === 1}
        onClose={() => setDeleteStep(0)}
        onConfirm={() => setDeleteStep(2)}
        title={deleteDialogContent[1].title}
        description={deleteDialogContent[1].description}
      />

      <ConfirmDialog
        isOpen={deleteStep === 2}
        onClose={() => setDeleteStep(0)}
        onConfirm={handleDeleteAccount}
        title={deleteDialogContent[2].title}
        description={deleteDialogContent[2].description}
      />

    </Container>
  );
};

export { EditProfile };