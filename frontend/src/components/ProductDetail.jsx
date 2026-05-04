import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Flex, Stack, Box, Heading, Text, Image, Badge, Button, Spinner, Center, Avatar, Separator } from "@chakra-ui/react";
import { getProductById, deleteProduct } from "../services/productService";
import { createTransaction } from "../services/transactionService";
import { useAuth } from "../hooks/useAuth";
import { LucideShoppingCart, LucideArrowLeft, LucideShieldAlert, LucideCheckCircle } from "lucide-react";
import { toaster } from './ui/toaster';
import { ConfirmDialog } from "./ConfirmDialog";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        toaster.create({
          title: "Error getting product. contact Admin",
          description: error.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      toaster.create({
        title: "Debes iniciar sesión",
        description: "Necesitas una cuenta para poder comprar",
        type: "warning",
      });
      return navigate("/login");
    }
    setConfirmAction("buy");
  };

  const handleAdminDelete = () => {
    setConfirmAction("delete");
  };

  const handleConfirm = async () => {
    if (confirmAction === "buy") {
      setBuying(true);
      try {
        const newTx = await createTransaction(product._id);
        navigate(`/transaction/${newTx._id}`);
      } catch (error) {
        toaster.create({
          title: "Error purchasing the product, contact Admin",
          description: error.message,
          type: "error",
        });
      } finally {
        setBuying(false);
        setConfirmAction(null);
      }
    }

    if (confirmAction === "delete") {
      try {
        await deleteProduct(product._id);
        navigate("/");
      } catch (error) {
        toaster.create({
          title: "Error deleting product, contact Admin",
          description: error.message,
          type: "error",
        });
      } finally {
        setConfirmAction(null);
      }
    }
  };

  const dialogContent = {
    buy: {
      title: "Confirmar compra",
      description: `¿Quieres comprar "${product?.title}" por ${product?.price_eur}€?`,
    },
    delete: {
      title: "Eliminar producto",
      description: "¿ESTÁS SEGURO? Vas a eliminar este producto permanentemente.",
    },
  };

  if (loading) return <Center h="60vh"><Spinner size="xl" color="brand.500" /></Center>;
  if (!product) return <Center h="60vh"><Text>Producto no encontrado</Text></Center>;

  const isOwner = user?._id === product.seller_id?._id;
  const isAvailable = product.available !== false;

  return (
    <Container maxW="5xl" py={10}>
      <Button 
        variant="ghost"
        color="earth.600"
        mb={6} 
        onClick={() => navigate(-1)} 
        leftIcon={<LucideArrowLeft size={18} />}
        _hover={{ bg: "sand.100" }}
      >
        Volver a la tienda
      </Button>

      <Flex direction={{ base: "column", md: "row" }} gap={12}>
        <Box flex="1" position="relative">
          <Image 
            src={product.image_url} 
            alt={product.title} 
            borderRadius="3xl" 
            shadow="2xl"
            w="100%"
            maxH="600px"
            objectFit="cover"
            opacity={!isAvailable ? 0.6 : 1}
          />
          {!isAvailable && (
            <Badge 
              position="absolute" 
              top="4" 
              right="4" 
              colorPalette="red" 
              size="lg" 
              variant="solid"
              borderRadius="full"
              px={4}
            >
              VENDIDO
            </Badge>
          )}
        </Box>

        <Stack flex="1" gap={8}>
          <Box>
            <Badge colorPalette="brand" variant="subtle" mb={3} px={3} py={1} borderRadius="full">
              {product.category_id?.name || "Categoría General"}
            </Badge>
            <Heading size="3xl" mb={4} letterSpacing="tight" color="earth.800">{product.title}</Heading>
            <Text fontSize="4xl" fontWeight="black" color="brand.600">
              {product.price_eur} €
            </Text>
          </Box>

          {product.category_id?.kg_co2_saved > 0 && (
            <Flex 
              align="center" 
              gap={4} 
              bg="brand.50" 
              p={4} 
              borderRadius="2xl" 
              border="1px solid" 
              borderColor="brand.200"
            >
              <LucideCheckCircle size={24} color="var(--chakra-colors-brand-500)" />
              <Box>
                <Text color="brand.800" fontWeight="bold" fontSize="md">
                  Ahorro EcoSwap: -{product.category_id.kg_co2_saved} Kg de CO2
                </Text>
                <Text fontSize="xs" color="brand.700">
                  Al elegir este producto usado, evitas el CO2 de una nueva fabricación.
                </Text>
              </Box>
            </Flex>
          )}

          <Separator borderColor="sand.200" />

          <Box>
            <Heading size="md" mb={3} color="earth.700">Descripción del producto</Heading>
            <Text color="earth.600" lineHeight="tall" fontSize="lg">
              {product.description}
            </Text>
          </Box>

          <Box>
            {isOwner ? (
              <Button width="full" size="xl" colorPalette="gray" variant="surface" disabled>
                Este producto es tuyo
              </Button>
            ) : isAvailable ? (
              <Button 
                width="full" 
                size="xl" 
                colorPalette="brand" 
                fontSize="xl"
                height="70px"
                loading={buying}
                onClick={handleBuy}
                leftIcon={<LucideShoppingCart size={24} />}
              >
                Comprar ahora
              </Button>
            ) : (
              <Button width="full" size="xl" colorPalette="red" variant="outline" disabled>
                Producto no disponible
              </Button>
            )}
            <Text fontSize="xs" color="earth.400" mt={3} textAlign="center">
              Compra segura protegida por EcoSwap. El vendedor recibirá el aviso al instante.
            </Text>
          </Box>

          <Separator borderColor="sand.200" />

          <Flex align="center" gap={4} p={5} bg="sand.50" borderRadius="2xl" border="1px solid" borderColor="sand.200">
            <Avatar.Root size="lg">
              <Avatar.Image src={product.seller_id?.profile_img} />
              <Avatar.Fallback name={product.seller_id?.name} />
            </Avatar.Root>
            <Box flex="1">
              <Text fontWeight="bold" fontSize="lg" color="earth.700">{product.seller_id?.name}</Text>
              <Text fontSize="sm" color="brand.600">Vendedor Verificado</Text>
            </Box>
          </Flex>

          {user?.role === "admin" && (
            <Stack p={5} border="2px dashed" borderColor="red.200" borderRadius="2xl" bg="red.50/50" gap={4}>
              <Flex align="center" gap={2} color="red.700">
                <LucideShieldAlert size={20} />
                <Heading size="xs">ADMIN</Heading>
              </Flex>
              <Button 
                colorPalette="red" 
                size="md"
                variant="solid" 
                onClick={handleAdminDelete}
              >
                Eliminar este producto permanentemente
              </Button>
            </Stack>
          )}
        </Stack>
      </Flex>

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={dialogContent[confirmAction]?.title}
        description={dialogContent[confirmAction]?.description}
      />
    </Container>
  );
};

export { ProductDetail };