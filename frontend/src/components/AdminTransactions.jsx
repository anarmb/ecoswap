import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Badge, Text, Center, Spinner, Stack, Box, Flex, IconButton, Button, Input } from "@chakra-ui/react";
import { getAllTransactions, deleteTransaction } from "../services/transactionService";
import { LucideTrash2, LucideArrowRight, LucideEye, LucideSearch } from "lucide-react";
import { toaster } from './ui/toaster';
import { ConfirmDialog } from "./ConfirmDialog";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        setTransactions(data);
      } catch (error) {
          toaster.create({
          title: "Error getting transactions",
          description: error.message,
          type: "error",
          });
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const search = searchTerm.toLowerCase();
    return (
      t._id.toLowerCase().includes(search) ||
      (t.product_id?.title || "").toLowerCase().includes(search) ||
      (t.buyer_id?.name || "").toLowerCase().includes(search) ||
      (t.seller_id?.name || "").toLowerCase().includes(search)
    );
  });

  const handleDeleteClick = (id) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTransaction(deleteTarget);
      setTransactions(transactions.filter(t => t._id !== deleteTarget));
    } catch (error) {
      toaster.create({
        title: "Error deleting transaction",
        description: error.message,
        type: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "green";
      case "pending": return "yellow";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  if (loading) return <Center p={10}><Spinner size="xl" color="brand.500" /></Center>;

  return (
    <Stack gap={6} w="full">
      <Flex justify="end" w="full">
        <Box position="relative" w={{ base: "full", md: "400px" }}>
          <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" zIndex="10" color="sand.400" pointerEvents="none">
            <LucideSearch size={18} />
          </Box>
          <Input 
            placeholder="Buscar por ID, producto, comprador..." 
            pl="10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="lg"
            bg="white"
            border="1px solid"
            borderColor="sand.300"
            _focus={{ borderColor: "brand.400", outline: "none" }}
          />
        </Box>
      </Flex>

      {filteredTransactions.length === 0 ? (
        <Center p={10} bg="sand.50" borderRadius="lg" border="1px dashed" borderColor="sand.300">
          <Text color="earth.500">
            {searchTerm ? `No hay coincidencias para "${searchTerm}"` : "No hay transacciones registradas."}
          </Text>
        </Center>
      ) : (
        <>
          <Stack gap={3} display={{ base: "flex", md: "none" }}>
            {filteredTransactions.map((t) => (
              <Box key={t._id} p={4} bg="white" borderRadius="lg" borderWidth="1px" borderColor="sand.200" shadow="sm">
                <Flex justify="space-between" align="start" mb={3}>
                  <Box>
                    <Button variant="ghost" size="xs" colorPalette="brand" fontWeight="bold" p={0} onClick={() => navigate(`/transaction/${t._id}`)}>
                      #{t._id.substring(0, 6)}
                    </Button>
                    <Text fontSize="10px" color="sand.500">{new Date(t.createdAt).toLocaleDateString()}</Text>
                  </Box>
                  <Badge colorPalette={getStatusColor(t.status)} variant="subtle">
                    {t.status?.toUpperCase()}
                  </Badge>
                </Flex>

                <Text fontWeight="bold" fontSize="sm" color="earth.700" mb={1}>{t.product_id?.title || "Producto eliminado"}</Text>

                <Flex align="center" gap={2} fontSize="xs" mb={3}>
                  <Box>
                    <Text fontWeight="bold" color="brand.600">{t.buyer_id?.name || "Desconocido"}</Text>
                    <Text color="sand.500">Comprador</Text>
                  </Box>
                  <LucideArrowRight size={14} color="var(--chakra-colors-sand-400)" />
                  <Box>
                    <Text fontWeight="bold" color="earth.500">{t.seller_id?.name || "Desconocido"}</Text>
                    <Text color="sand.500">Vendedor</Text>
                  </Box>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text fontWeight="bold" color="brand.600">{t.price_eur || t.product_id?.price_eur || 0}€</Text>
                  <Flex gap={2}>
                    <IconButton size="sm" variant="subtle" colorPalette="brand" aria-label="Ver detalles" onClick={() => navigate(`/transaction/${t._id}`)}>
                      <LucideEye size={16} />
                    </IconButton>
                    <IconButton size="sm" variant="ghost" colorPalette="red" aria-label="Eliminar" onClick={() => handleDeleteClick(t._id)}>
                      <LucideTrash2 size={16} />
                    </IconButton>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Stack>

          <Table.Root variant="line" bg="white" shadow="sm" borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor="sand.200" display={{ base: "none", md: "table" }}>
            <Table.Header bg="sand.50">
              <Table.Row>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">ID / Fecha</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">Producto</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">Participantes</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">Total</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">Estado</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold" textAlign="right">Acciones</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredTransactions.map((t) => (
                <Table.Row key={t._id} _hover={{ bg: "sand.50" }} transition="background 0.15s">
                  <Table.Cell>
                    <Button variant="ghost" size="xs" colorPalette="brand" fontWeight="bold" onClick={() => navigate(`/transaction/${t._id}`)}>
                      #{t._id.substring(0, 6)}
                    </Button>
                    <Text fontSize="10px" color="sand.500" mt={1}>{new Date(t.createdAt).toLocaleDateString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="bold" fontSize="sm">{t.product_id?.title || "Producto eliminado"}</Text>
                    <Text fontSize="xs" color="sand.500">Ref: {t.product_id?._id || "N/A"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap={2} fontSize="xs">
                      <Box>
                        <Text fontWeight="bold" color="brand.600">{t.buyer_id?.name || "Desconocido"}</Text>
                        <Text color="sand.500">Comprador</Text>
                      </Box>
                      <LucideArrowRight size={14} color="var(--chakra-colors-sand-400)" />
                      <Box>
                        <Text fontWeight="bold" color="earth.500">{t.seller_id?.name || "Desconocido"}</Text>
                        <Text color="sand.500">Vendedor</Text>
                      </Box>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="bold" color="brand.600">{t.price_eur || t.product_id?.price_eur || 0}€</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={getStatusColor(t.status)} variant="subtle">
                      {t.status?.toUpperCase()}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="end" gap={2}>
                      <IconButton size="sm" variant="subtle" colorPalette="brand" aria-label="Ver detalles" onClick={() => navigate(`/transaction/${t._id}`)}>
                        <LucideEye size={16} />
                      </IconButton>
                      <IconButton size="sm" variant="ghost" colorPalette="red" aria-label="Eliminar" onClick={() => handleDeleteClick(t._id)}>
                        <LucideTrash2 size={16} />
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar transacción"
        description="¿Eliminar registro de transacción?"
      />
    </Stack>
  );
};

export { AdminTransactions };