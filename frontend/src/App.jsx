import { Routes, Route } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import { Toaster } from "./components/ui/toaster";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProductDetail } from './components/ProductDetail';
import { Navbar } from "./components/Navbar";
import { Footer } from './components/Footer';
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { MyProfile } from './pages/MyProfile';
import { EditProfile } from './pages/EditProfile';
import { UploadProduct } from './pages/UploadProduct';
import { EditProduct } from './pages/EditProduct';
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { NotFound } from './pages/NotFound';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminCategoriesPage } from "./pages/AdminCategoriesPage";
import { AdminTransactionsPage } from "./pages/AdminTransactionsPage";
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      
      <Box as="main" flex="1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />

          {/* User routes (Login) */}
          <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadProduct /></ProtectedRoute>} />
          <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          <Route path="/transaction/:id" element={<ProtectedRoute><TransactionDetailPage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />          
          <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
          <Route path="/admin/transactions" element={<AdminRoute><AdminTransactionsPage /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>

      <Footer />
      <Toaster />
    </Flex>
  );
}

export { App };