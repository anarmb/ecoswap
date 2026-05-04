import { useEffect, useState } from "react";
import { 
  Stack, Table, Center, Spinner, Button, 
  Input, Box, Flex, IconButton, Badge 
} from "@chakra-ui/react";
import { getAllCategories, createCategory, deleteCategory, updateCategory } from "../services/categoryService";
import { LucideTrash2, LucidePlus, LucidePencil, LucideCheck, LucideX } from "lucide-react";
import { toaster } from './ui/toaster';
import { ConfirmDialog } from "./ConfirmDialog";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toaster.create({
        title: "Error getting categories",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCreating(true);
    try {
      await createCategory({ name: newCatName });
      setNewCatName("");
      fetchCategories();
    } catch (error) {
      toaster.create({
        title: "Error creating category",
        description: error.message,
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateCategory(id, { name: editName });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toaster.create({
        title: "Error updating category",
        description: error.message,
        type: "error",
      });
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(deleteTarget.id);
      setCategories(categories.filter(c => c._id !== deleteTarget.id));
    } catch (error) {
      toaster.create({
        title: "Error deleting category",
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
      <Box as="form" onSubmit={handleCreate} p={5} bg="sand.50" borderRadius="xl" borderWidth="1px" borderColor="sand.200">
        <Flex gap={4}>
          <Input 
            placeholder="Nueva categoría (ej: Deporte, Hogar...)" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            bg="white"
            borderColor="sand.300"
            _focus={{ borderColor: "brand.400" }}
          />
          <Button type="submit" colorPalette="brand" loading={creating} gap={2}>
            <LucidePlus size={18} /> Añadir
          </Button>
        </Flex>
      </Box>

      <Table.Root variant="line" bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" borderColor="sand.200">
        <Table.Header bg="sand.50">
          <Table.Row>
            <Table.ColumnHeader color="earth.600" fontWeight="semibold">Nombre de la Categoría</Table.ColumnHeader>
            <Table.ColumnHeader color="earth.600" fontWeight="semibold" textAlign="right">Acciones</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((cat) => (
            <Table.Row key={cat._id} _hover={{ bg: "sand.50" }} transition="background 0.15s">
              <Table.Cell>
                {editingId === cat._id ? (
                  <Input 
                    size="sm" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    borderColor="brand.300"
                    _focus={{ borderColor: "brand.500" }}
                  />
                ) : (
                  <Badge variant="subtle" colorPalette="brand" size="lg" px={3}>
                    {cat.name}
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Flex justify="end" gap={2}>
                  {editingId === cat._id ? (
                    <>
                      <IconButton 
                        variant="ghost" 
                        colorPalette="brand"
                        onClick={() => handleSaveEdit(cat._id)}
                      >
                        <LucideCheck size={18} />
                      </IconButton>
                      <IconButton 
                        variant="ghost" 
                        colorPalette="gray" 
                        onClick={() => setEditingId(null)}
                      >
                        <LucideX size={18} />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton 
                        variant="ghost" 
                        colorPalette="earth"
                        onClick={() => handleStartEdit(cat)}
                      >
                        <LucidePencil size={18} />
                      </IconButton>
                      <IconButton 
                        variant="ghost" 
                        colorPalette="red"
                        onClick={() => handleDeleteClick(cat._id, cat.name)}
                      >
                        <LucideTrash2 size={18} />
                      </IconButton>
                    </>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar categoría"
        description={`¿Seguro que quieres eliminar la categoría "${deleteTarget?.name}"?`}
      />
    </Stack>
  );
};

export { AdminCategories };