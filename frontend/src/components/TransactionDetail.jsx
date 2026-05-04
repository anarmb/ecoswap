import { useEffect, useState } from "react";
import { Stack, Box, Heading, Text, Badge, Flex, Separator, Button, Center, Spinner, Avatar } from "@chakra-ui/react";
import { getTransactionById, updateTransactionStatus } from "../services/transactionService";
import { LucidePackage, LucideMail, LucideCalendar, LucideCheckCircle, LucideShieldCheck, LucideXCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toaster } from './ui/toaster';
import { ConfirmDialog } from "./ConfirmDialog";

const TransactionDetail = ({ transactionId }) => {
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getTransactionById(transactionId);
        setTx(data);
      } catch (error) {
        toaster.create({
            title: "Error getting transaction, contact Admin",
            description: error.message,
            type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [transactionId]);

  const handleConfirm = async () => {
    try {
      await updateTransactionStatus(tx._id, confirmAction);
      setTx({ ...tx, status: confirmAction });
    } catch (error) {
      toaster.create({
        title: "Error updating transaction, contact Admin",
        description: error.message,
        type: "error",
      });
    } finally {
      setConfirmAction(null);
    }
  };

  const dialogContent = {
    completed: {
      title: "Confirmar transacción",
      description: "¿Confirmas que la transacción se ha completado con éxito?",
    },
    cancelled: {
      title: "Cancelar transacción",
      description: "¿Estás seguro de cancelar esta transacción? El producto volverá a estar disponible.",
    },
  };

  if (loading) return <Center p={20}><Spinner size="xl" color="brand.500" /></Center>;
  if (!tx) return <Center p={20}><Text>Transacción no encontrada.</Text></Center>;

  const isAdmin = currentUser?.role === "admin";
  const isBuyer = tx.buyer_id?._id === currentUser?._id;
  const isSeller = tx.seller_id?._id === currentUser?._id;  
  const otherParty = isBuyer ? tx.seller_id : tx.buyer_id;

  return (
    <Stack gap={8}>
      <Box p={8} bg="white" borderRadius="2xl" shadow="md" border="1px solid" borderColor="sand.200">
        <Flex justify="space-between" align="center" mb={6} direction={{ base: "column", md: "row" }} gap={4}>
          <Stack gap={1}>
            <Text fontSize="xs" color="earth.400" textTransform="uppercase" fontWeight="bold">
              ID de Transacción: {tx._id}
            </Text>
            <Heading size="xl" color="earth.800">Resumen del Intercambio</Heading>
          </Stack>
          <Badge 
            colorPalette={tx.status === "completed" ? "green" : tx.status === "cancelled" ? "red" : "yellow"} 
            size="lg" 
            p={2} 
            variant="solid"
            borderRadius="md"
          >
            {tx.status?.toUpperCase()}
          </Badge>
        </Flex>

        <Separator mb={6} borderColor="sand.200" />

        <Flex gap={6} align="center" p={4} bg="sand.50" borderRadius="xl" mb={8} border="1px solid" borderColor="sand.200">
          <Box bg="white" p={3} borderRadius="lg" shadow="sm">
            <LucidePackage size={30} color="var(--chakra-colors-brand-500)" />
          </Box>
          <Stack gap={0}>
            <Text fontWeight="bold" fontSize="lg" color="earth.700">{tx.product_id?.title || "Producto no disponible"}</Text>
            <Text color="brand.600" fontWeight="bold" fontSize="xl">{tx.price_total} €</Text>
          </Stack>
        </Flex>

        {isAdmin && !isBuyer && !isSeller ? (
          <Stack gap={6}>
            <Flex align="center" gap={2} color="earth.600">
              <LucideShieldCheck size={20} />
              <Heading size="sm" color="earth.700">Panel de transacciones (Admin)</Heading>
            </Flex>
            <Flex direction={{ base: "column", md: "row" }} gap={4} justify="space-between">
              <Box p={4} border="1px solid" borderColor="sand.200" borderRadius="xl" flex="1" bg="sand.50">
                <Text fontSize="xs" color="earth.400" mb={2}>COMPRADOR</Text>
                <Text fontWeight="bold" color="earth.700">{tx.buyer_id?.name || "N/A"}</Text>
                <Text fontSize="sm" color="earth.500">{tx.buyer_id?.email}</Text>
              </Box>
              <Box p={4} border="1px solid" borderColor="sand.200" borderRadius="xl" flex="1" bg="sand.50">
                <Text fontSize="xs" color="earth.400" mb={2}>VENDEDOR</Text>
                <Text fontWeight="bold" color="earth.700">{tx.seller_id?.name || "N/A"}</Text>
                <Text fontSize="sm" color="earth.500">{tx.seller_id?.email}</Text>
              </Box>
            </Flex>
          </Stack>
        ) : (
          <Stack gap={4}>
            <Heading size="sm" color="earth.600">
              {isBuyer ? "Datos del Vendedor" : "Datos del Comprador"}
            </Heading>
            <Flex align="center" gap={4} p={4} border="1px solid" borderColor="sand.200" borderRadius="xl" bg="sand.50">
              <Avatar.Root size="md">
                <Avatar.Image src={otherParty?.profile_img} />
                <Avatar.Fallback name={otherParty?.name || "?"} />
              </Avatar.Root>
              <Stack gap={0}>
                <Text fontWeight="bold" color="earth.700">{otherParty?.name || "Usuario de EcoSwap"}</Text>
                <Flex align="center" gap={2} color="earth.500" fontSize="sm">
                  <LucideMail size={14} />
                  <Text>{otherParty?.email || "Email no disponible"}</Text>
                </Flex>
              </Stack>
            </Flex>
          </Stack>
        )}

        {tx.status === "pending" && (isAdmin || isSeller) && (
          <Stack direction={{ base: "column", sm: "row" }} gap={4} mt={8}>
            <Button 
              flex="1"
              colorPalette={isAdmin && !isSeller ? "earth" : "brand"} 
              size="lg" 
              gap={2}
              onClick={() => setConfirmAction("completed")}
            >
              <LucideCheckCircle size={20} /> 
              {isAdmin && !isSeller ? "Forzar Completado" : "Confirmar Entrega"}
            </Button>
            
            <Button 
              variant="outline"
              colorPalette="red"
              size="lg"
              gap={2}
              onClick={() => setConfirmAction("cancelled")}
            >
              <LucideXCircle size={20} /> Cancelar
            </Button>
          </Stack>
        )}
      </Box>

      <Center>
        <Flex align="center" gap={2} color="earth.400" fontSize="xs">
          <LucideCalendar size={14} />
          <Text>Registro creado el {new Date(tx.createdAt).toLocaleString()}</Text>
        </Flex>
      </Center>

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={dialogContent[confirmAction]?.title}
        description={dialogContent[confirmAction]?.description}
      />
    </Stack>
  );
};

export { TransactionDetail };