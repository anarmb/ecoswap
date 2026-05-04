import { Card, Image, Text, Badge, Box } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Box 
      as={RouterLink} 
      to={`/product/${product._id}`} 
      style={{ textDecoration: 'none' }}
      display="block"
    >
      <Card.Root 
        maxW="sm" 
        overflow="hidden" 
        variant="outline"
        cursor="pointer"
        borderColor="sand.200"
        _hover={{ shadow: "lg", bg: "sand.50", transform: "translateY(-4px)", transition: "all 0.2s", borderColor: "brand.300" }}
      >
        <Box position="relative">
          <Image
            src={product.image_url || "https://via.placeholder.com/300"}
            alt={product.title}
            h="200px"
            w="100%"
            objectFit="cover"
          />
          <Badge 
            position="absolute" 
            top="2" 
            right="2" 
            bg="brand.500" 
            color="white" 
            variant="solid"
            borderRadius="full"
            px={3}
          >
            {product.category_id?.name || "Eco"}
          </Badge>
        </Box>

        <Card.Body gap="2" bg="white">
          <Card.Title truncate title={product.title} fontSize="lg" color="earth.700">
            {product.title}
          </Card.Title>
          <Text fontWeight="bold" fontSize="xl" color="brand.600">
            {product.price_eur} €
          </Text>
          <Card.Description lineClamp={2} color="earth.500">
            {product.description}
          </Card.Description>
        </Card.Body>

        <Card.Footer borderTopWidth="1px" borderColor="sand.200" py="3" bg="sand.50">
          <Text fontSize="xs" color="earth.500">
            Vendido por: <Text as="span" fontWeight="semibold" color="earth.600">{product.seller_id?.name || "Usuario Eco"}</Text>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  );
};

export {ProductCard}