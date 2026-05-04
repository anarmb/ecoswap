import { useEffect, useState } from "react";
import { Container, Stack, Heading, Input, Button, Textarea, Box, Field, Text } from "@chakra-ui/react";
import { createProduct } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";

const UploadProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_eur: "",
    category_id: "",
    condition: "bueno",
    kg_co2_saved: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
  setImage(e.target.files[0]);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price_eur", formData.price_eur);
    data.append("category_id", formData.category_id);
    data.append("condition", formData.condition);
    data.append("kg_co2_saved", formData.kg_co2_saved || 0);

    if (image) data.append("image_url", image);

    try {
      await createProduct(data);
      toaster.create({
        title: "Producto publicado",
        description: "Se ha subido correctamente",
        type: "success",
      });
      setTimeout(() => navigate("/"), 1200);

    } catch (error) {
      toaster.create({
        title: "Error al subir el producto",
        description: error?.message || "Inténtalo de nuevo más tarde",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <Stack gap={8} as="form" onSubmit={handleSubmit} p={8} bg="sand.50" borderRadius="2xl" borderWidth="1px" borderColor="sand.200">
        <Heading size="xl" textAlign="center" color="brand.600">
          Subir nuevo producto
        </Heading>

        <Stack gap={6}>
          <Field.Root required>
            <Field.Label color="earth.600">Título del producto</Field.Label>
            <Input name="title" placeholder="Ej: Bicicleta vintage" onChange={handleChange} bg="white" borderColor="sand.300" _focus={{ borderColor: "brand.400" }} />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="earth.600">Categoría</Field.Label>
            <select
              name="category_id"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #D4C9A8",
                background: "white",
                color: "#5a5234",
              }}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field.Root>

          <Field.Root required>
            <Field.Label color="earth.600">Condición</Field.Label>
            <select
              name="condition"
              onChange={handleChange}
              defaultValue="bueno"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #D4C9A8",
                background: "white",
                color: "#5a5234",
              }}
            >
              <option value="nuevo">Nuevo</option>
              <option value="como nuevo">Como nuevo</option>
              <option value="bueno">Bueno</option>
              <option value="aceptable">Aceptable</option>
            </select>
          </Field.Root>

          <Field.Root required>
            <Field.Label color="earth.600">Descripción</Field.Label>
            <Textarea name="description" placeholder="Detalles del producto..." onChange={handleChange} bg="white" borderColor="sand.300" _focus={{ borderColor: "brand.400" }} />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="earth.600">Precio (€)</Field.Label>
            <Input 
              name="price_eur" 
              type="number" 
              step="0.01" 
              min="0"
              placeholder="0.00" 
              onChange={handleChange} 
              bg="white" 
              borderColor="sand.300" 
              _focus={{ borderColor: "brand.400" }} 
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label color="earth.600">Imagen</Field.Label>
            <Box border="2px dashed" borderColor="sand.300" p={4} borderRadius="md" bg="white" overflow="hidden">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ width: "100%", maxWidth: "100%" }} 
              />
            </Box>
          </Field.Root>

          <Button type="submit" colorPalette="brand" size="lg" loading={loading}>
            Publicar Producto
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export { UploadProduct };