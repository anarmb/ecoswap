import { useEffect, useState } from "react";
import { SimpleGrid, Heading, Text, Button, Stack, Box, Image, Badge } from "@chakra-ui/react";
import { getMyProducts, deleteProduct } from "../services/productService";
import { Link as RouterLink } from "react-router-dom";
import { toaster } from './ui/toaster';
import { ConfirmDialog } from "./ConfirmDialog";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchMyProducts = async () => {
    try {
      const data = await getMyProducts();
      setProducts(data);
    } catch (error) {
      toaster.create({
        title: "Error getting products",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(deleteTarget);
      setProducts(products.filter(p => p._id !== deleteTarget));
    } catch (error) {
      toaster.create({
        title: "Error deleting product",
        description: error.message,
        type: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Text>Cargando tus productos...</Text>;

  return (
    <Stack gap={6}>
      <Heading size="md" color="earth.700">Mis Productos en Venta ({products.length})</Heading>

      {products.length === 0 ? (
        <Box p={10} textAlign="center" border="2px dashed" borderColor="sand.300" borderRadius="xl" bg="sand.50">
          <Text color="earth.500">Aún no has subido nada al catálogo.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {products.map((product) => {
            const isAvailable = product.available !== false;

            return (
              <Box key={product._id} border="1px solid" borderColor="sand.200" borderRadius="lg" overflow="hidden" position="relative" _hover={{ shadow: "md", borderColor: "brand.200" }} transition="all 0.2s">
                <Image 
                  src={product.image || product.image_url} 
                  alt={product.title} 
                  h="150px" 
                  w="100%" 
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/150?text=Sin+Imagen"
                  opacity={!isAvailable ? 0.6 : 1}
                />
                
                {!isAvailable && (
                  <Badge position="absolute" top={2} right={2} colorPalette="red" variant="solid">
                    VENDIDO
                  </Badge>
                )}
                
                <Stack p={3} gap={1} bg="white">
                  <Text fontWeight="bold" truncate color="earth.700">{product.title}</Text>
                  <Text color="brand.600" fontWeight="semibold">{product.price_eur} €</Text>
                  
                  {isAvailable ? (
                    <Stack direction="row" mt={2} gap={2}>
                      <Button 
                        as={RouterLink}
                        to={`/edit-product/${product._id}`}
                        size="xs" 
                        variant="outline"
                        colorPalette="brand"
                        flex="1"
                      >
                        Editar
                      </Button>
                      <Button 
                        size="xs" 
                        colorPalette="red" 
                        variant="ghost"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        Borrar
                      </Button>
                    </Stack>
                  ) : (
                    <Box mt={2}>
                      <Badge colorPalette="gray" variant="surface" w="full" justifyContent="center" py={1.5}>
                        Vendido
                      </Badge>
                    </Box>
                  )}
                </Stack>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Borrar producto"
        description="¿Estás seguro de que quieres borrar este producto?"
      />
    </Stack>
  );
};

export { MyProducts };