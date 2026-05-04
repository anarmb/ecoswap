import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Stack, Heading, Input, Button, Textarea, Box, Field, Spinner, Center } from "@chakra-ui/react";
import { getProductById, updateProduct } from "../services/productService";
import { toaster } from "../components/ui/toaster";

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", price_eur: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setFormData({
          title: data.title,
          description: data.description,
          price_eur: data.price_eur,
        });
      } catch (error) {
        toaster.create({
        title: "Error al cargar producto",
        description: error?.message || "No se ha podido cargar el producto",
        type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price_eur", formData.price_eur);
    
    if (image) {
      const imageFile = image instanceof FileList ? image : image;
      data.append("image_url", imageFile);
    }

    try {
      await updateProduct(id, data);
      toaster.create({
        title: "Producto actualizado",
        description: "Los cambios se han guardado correctamente",
        type: "success",
      });

      setTimeout(() => navigate("/profile"), 1200);
    } catch (error) {
      toaster.create({
        title: "Error al actualizar",
        description: error?.message || "Ha ocurrido un error inesperado",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Center h="60vh"><Spinner /></Center>;

  return (
    <Container maxW="md" py={10}>
      <Stack gap={8} as="form" onSubmit={handleSubmit}>
        <Heading size="xl" textAlign="center" color="earth.700">Editar Producto</Heading>
        <Stack gap={4} p={8} bg="sand.50" borderRadius="2xl" borderWidth="1px" borderColor="sand.200">
          <Field.Root>
            <Field.Label color="earth.600">Título</Field.Label>
            <Input name="title" value={formData.title} onChange={handleChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
          </Field.Root>
          <Field.Root>
            <Field.Label color="earth.600">Precio (€)</Field.Label>
            <Input name="price_eur" type="number" value={formData.price_eur} onChange={handleChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
          </Field.Root>
          <Field.Root>
            <Field.Label color="earth.600">Descripción</Field.Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} borderColor="sand.300" _focus={{ borderColor: "brand.400" }} bg="white" />
          </Field.Root>
          <Field.Root>
            <Field.Label color="earth.600">Cambiar Imagen (opcional)</Field.Label>
            <Box border="2px dashed" borderColor="sand.300" borderRadius="md" p={4} bg="white">
              <Input type="file" border="none" p={0} onChange={(e) => setImage(e.target.files[0])} />
            </Box>
          </Field.Root>
          <Button type="submit" colorPalette="brand" loading={updating} size="lg" mt={2}>Guardar Cambios</Button>
        </Stack>
      </Stack>
    </Container>
  );
};