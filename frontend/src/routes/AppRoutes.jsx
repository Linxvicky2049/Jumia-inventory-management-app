import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import ProductList from "../pages/products/ProductList";
import ProductDetails from "../pages/products/ProductDetails";
import CreateProduct from "../pages/products/CreateProduct";
import EditProduct from "../pages/products/EditProduct";
import CategoryList from "../pages/categories/CategoryList";
import SupplierList from "../pages/suppliers/SupplierList";
import StockIn from "../pages/inventory/StockIn";
import StockOut from "../pages/inventory/StockOut";
import StockMovements from "../pages/inventory/StockMovements";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<EditProduct />} />

        <Route path="/categories" element={<CategoryList />} />
        <Route path="/suppliers" element={<SupplierList />} />

        <Route path="/inventory/stock-in" element={<StockIn />} />
        <Route path="/inventory/stock-out" element={<StockOut />} />
        <Route
          path="/inventory/movements"
          element={<StockMovements />}
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-[#07090f] text-white">
            <div className="text-center">
              <h1 className="text-6xl font-bold">404</h1>
              <p className="mt-3 text-gray-400">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;