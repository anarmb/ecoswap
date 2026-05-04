import { useEffect, useState } from "react";
import { Table, Badge, Avatar, Text, Center, Spinner, Button, Input, Stack, Box, Flex } from "@chakra-ui/react";
import { getAllUsers, deleteUser } from "../services/userService";
import { LucideTrash2, LucideSearch } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toaster } from './ui/toaster';
import { ConfirmDialog } from "./ConfirmDialog";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
          toaster.create({
          title: "Error getting users",
          description: error.message,
          type: "error",
          });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(deleteTarget.id);
      setUsers(users.filter(u => u._id !== deleteTarget.id));
    } catch (error) {
      toaster.create({
        title: "Error deleting user",
        description: error.message,
        type: "error",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Center p={10}><Spinner size="xl" /></Center>;

  return (
    <Stack gap={6}>
      <Flex justify="end">
        <Box position="relative" w={{ base: "full", md: "350px" }}>
          <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" zIndex="1" color="sand.400">
            <LucideSearch size={18} />
          </Box>
          <Input 
            placeholder="Buscar por email o nombre..." 
            pl="10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="lg"
            bg="white"
            borderColor="sand.300"
            _focus={{ borderColor: "brand.400" }}
          />
        </Box>
      </Flex>

      {filteredUsers.length === 0 ? (
        <Center p={10} bg="sand.50" borderRadius="lg" border="1px dashed" borderColor="sand.300">
          <Text color="earth.500">No hay coincidencias con "{searchTerm}"</Text>
        </Center>
      ) : (
        <>
          <Stack gap={3} display={{ base: "flex", md: "none" }}>
            {filteredUsers.map((u) => (
              <Box key={u._id} p={4} bg="white" borderRadius="lg" borderWidth="1px" borderColor="sand.200" shadow="sm">
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={3}>
                    <Avatar.Root size="sm">
                      <Avatar.Image src={u.profile_img} />
                      <Avatar.Fallback name={u.name} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="bold" color="earth.700">{u.name}</Text>
                      <Text fontSize="xs" color="earth.500">{u.email}</Text>
                      <Badge colorPalette={u.role === "admin" ? "earth" : "brand"} mt={1}>
                        {u.role}
                      </Badge>
                    </Box>
                  </Flex>
                  <Button 
                    variant="ghost" 
                    colorPalette="red"
                    onClick={() => handleDeleteClick(u._id, u.name)}
                    disabled={currentUser && u._id === currentUser._id}
                  >
                    <LucideTrash2 size={16} />
                  </Button>
                </Flex>
              </Box>
            ))}
          </Stack>

          <Table.Root variant="line" bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" borderColor="sand.200" display={{ base: "none", md: "table" }}>
            <Table.Header bg="sand.50">
              <Table.Row>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">Usuario</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">Email</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold">Rol</Table.ColumnHeader>
                <Table.ColumnHeader color="earth.600" fontWeight="semibold" textAlign="right">Acciones</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredUsers.map((u) => (
                <Table.Row key={u._id} _hover={{ bg: "sand.50" }} transition="background 0.15s">
                  <Table.Cell>
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="xs">
                        <Avatar.Image src={u.profile_img} />
                        <Avatar.Fallback name={u.name} />
                      </Avatar.Root>
                      <Text fontWeight="bold" color="earth.700">{u.name}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell color="earth.600">{u.email}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={u.role === "admin" ? "earth" : "brand"}>
                      {u.role}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button 
                      variant="ghost" 
                      colorPalette="red"
                      onClick={() => handleDeleteClick(u._id, u.name)}
                      disabled={currentUser && u._id === currentUser._id}
                    >
                      <LucideTrash2 size={16} />
                    </Button>
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
        title="Eliminar usuario"
        description={`ATENCIÓN: ¿Quieres eliminar a ${deleteTarget?.name}?`}
      />
    </Stack>
  );
};

export { AdminUsers };