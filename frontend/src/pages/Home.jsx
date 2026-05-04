import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, SimpleGrid, Heading, Text, Center, Spinner, Stack, Box, Badge, Flex, Button, NativeSelect } from "@chakra-ui/react";
import { getAllProducts } from "../services/productService";
import { getAllCategories } from "../services/categoryService";
import { ProductCard } from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search"); 
  const categoryTerm = searchParams.get("category");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts({ 
            title: searchTerm || undefined, 
            category: categoryTerm || undefined 
          }),
          getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al cargar la página de inicio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, categoryTerm]);

  const handleCategoryClick = (categoryId) => {
    if (categoryTerm === categoryId) {
      searchParams.delete("category"); 
    } else {
      searchParams.set("category", categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (!value) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box as="main" w="100%" overflowX="hidden">
      <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
        <Stack gap={10}>
          
          <Box>
            <Heading size="xs" mb={4} color="earth.400" textTransform="uppercase" letterSpacing="widest">
              Explora por categorías
            </Heading>

            <Box display={{ base: "block", md: "none" }}>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={categoryTerm || ""}
                  onChange={handleCategorySelect}
                  borderRadius="full"
                  borderColor="sand.300"
                  bg="white"
                  color="earth.700"
                  _focus={{ borderColor: "brand.400" }}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Flex
              gap={3}
              pb={4}
              display={{ base: "none", md: "flex" }}
              flexWrap="wrap"
            >
              <Badge
                px={5}
                py={2}
                borderRadius="full"
                cursor="pointer"
                flexShrink={0}
                variant={!categoryTerm ? "solid" : "outline"}
                colorPalette={!categoryTerm ? "brand" : "sand"}
                onClick={() => {
                  searchParams.delete("category");
                  setSearchParams(searchParams);
                }}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
              >
                Todas
              </Badge>

              {categories.map((cat) => {
                const isSelected = categoryTerm === cat._id;
                return (
                  <Badge
                    key={cat._id}
                    px={5}
                    py={2}
                    borderRadius="full"
                    cursor="pointer"
                    flexShrink={0}
                    userSelect="none"
                    variant={isSelected ? "solid" : "outline"}
                    colorPalette={isSelected ? "brand" : "sand"}
                    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                    _hover={{ 
                      transform: "translateY(-2px)", 
                      bg: isSelected ? "brand.600" : "sand.100",
                      shadow: "md",
                      borderColor: "brand.400"
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    onClick={() => handleCategoryClick(cat._id)}
                  >
                    {cat.name}
                  </Badge>
                );
              })}
            </Flex>
          </Box>

          <Stack direction={{ base: "column", md: "row" }} align={{ base: "start", md: "center" }} justify="space-between" gap={2}>
            <Heading size={{ base: "md", md: "lg" }} color="earth.700">
              {searchTerm ? `Resultados para "${searchTerm}"` : 
               categoryTerm ? `Categoría: ${categories.find(c => c._id === categoryTerm)?.name}` : 
               "Novedades en EcoSwap"}
            </Heading>
            <Text color="earth.400" fontWeight="medium" fontSize="sm">
              {products.length} productos encontrados
            </Text>
          </Stack>

          {products.length === 0 ? (
            <Center p={{ base: 10, md: 20 }} bg="sand.50" borderRadius="3xl" flexDirection="column" gap={3} border="1px dashed" borderColor="sand.300">
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="earth.400" textAlign="center">
                No hay productos que coincidan
              </Text>
              <Text color="earth.500" textAlign="center">
                Prueba a quitar los filtros o buscar otro término.
              </Text>
              <Button 
                variant="link" 
                colorPalette="brand" 
                onClick={() => setSearchParams({})}
              >
                Ver todos los productos
              </Button>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={{ base: 4, md: 8 }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export { Home };