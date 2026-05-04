import { useEffect, useState } from "react";
import { Table, Badge, Text, Center, Spinner, Stack, Button } from "@chakra-ui/react";
import { getAllTransactions, updateTransactionStatus } from "../services/transactionService";
import { useAuth } from "../hooks/useAuth";
import { toaster } from './ui/toaster';

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyTransactions = async () => {
      try {
        const data = await getAllTransactions(true);
        setTransactions(data);
      } catch (error) {
        toaster.create({
            title: "Error getting transactions, contact Admin",
            description: error.message,
            type: "error",
          });
      } finally {
        setLoading(false);
      }
    };
    fetchMyTransactions();
  }, []);

  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      const updated = await updateTransactionStatus(transactionId, newStatus);
      setTransactions(transactions.map(t => 
        t._id === transactionId ? { ...t, status: updated.status } : t
      ));
    } catch (error) {
      toaster.create({
        title: "Error updating transaction, contact Admin",
        description: error.message,
        type: "error",
      });
    }
  };

  if (loading) return <Center p={10}><Spinner size="xl" color="brand.500" /></Center>;

  return (
    <Stack gap={6}>
      {transactions.length === 0 ? (
        <Center p={10} bg="sand.50" borderRadius="lg" border="1px dashed" borderColor="sand.300">
          <Text color="earth.500">Aún no has realizado ninguna transacción.</Text>
        </Center>
      ) : (
        <Table.Root variant="line" bg="white" shadow="sm" borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor="sand.200">
          <Table.Header bg="sand.50">
            <Table.Row>
              <Table.ColumnHeader color="earth.600" fontWeight="semibold">Tipo</Table.ColumnHeader>
              <Table.ColumnHeader color="earth.600" fontWeight="semibold">Producto</Table.ColumnHeader>
              <Table.ColumnHeader color="earth.600" fontWeight="semibold">Otro Usuario</Table.ColumnHeader>
              <Table.ColumnHeader color="earth.600" fontWeight="semibold">Estado</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {transactions.map((t) => {
              const isBuyer = t.buyer_id?._id === user?._id;
              const isPending = t.status === "pending";

              return (
                <Table.Row key={t._id} _hover={{ bg: "sand.50" }} transition="background 0.15s">
                  <Table.Cell>
                    <Badge colorPalette={isBuyer ? "brand" : "earth"} variant="solid">
                      {isBuyer ? "COMPRA" : "VENTA"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="bold" color="earth.700">{t.product_id?.title}</Text>
                    <Text fontSize="xs" color="earth.400">{t.price_total}€</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="earth.600">
                      {isBuyer ? t.seller_id?.name : t.buyer_id?.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="outline"
                      colorPalette={
                        t.status === "completed" ? "green" :
                        t.status === "pending" ? "yellow" : "red"
                      }
                    >
                      {t.status === "pending" ? "Pendiente" :
                       t.status === "completed" ? "Completado" : "Cancelado"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {isBuyer && isPending && (
                      <Stack direction="row" gap={2}>
                        <Button
                          size="xs"
                          colorPalette="brand"
                          onClick={() => handleStatusChange(t._id, "completed")}
                        >
                          Confirmar recepción
                        </Button>
                        <Button
                          size="xs"
                          colorPalette="red"
                          variant="outline"
                          onClick={() => handleStatusChange(t._id, "cancelled")}
                        >
                          Cancelar
                        </Button>
                      </Stack>
                    )}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      )}
    </Stack>
  );
};

export { UserTransactions };