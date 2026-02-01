import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/admin/adminlogin";
import AdminRegister from "./pages/admin/adminregister";
import Home from "./pages/home";
import AdminForgotPass from "./pages/admin/adminforgotpass";
import AdminDashboard from "./pages/admin/admindashboard";
import AdminNotification from "./pages/admin/adminnotification";
import AdminProfile from "./pages/admin/adminprofile";
import AdminBuyer from "./pages/admin/adminbuyer";
import AdminSeller from "./pages/admin/adminseller";
import AdminProduct from "./pages/admin/adminproduct";
import AdminOrder from "./pages/admin/adminorder";
import AdminReport from "./pages/admin/adminreport";
import AdminSetting from "./pages/admin/adminsetting";
import AdminSupplier from "./pages/admin/AdminSupplier";
import AdminCategory from "./pages/admin/admincategory";
import ProtectedRoute from "./components/ProtectedRoute";
import BuyerLogin from "./pages/customer/buyerlogin";
import BuyerRegister from "./pages/customer/buyerregister";
import BuyerWishlist from "./pages/customer/buyerwishlist";
import Buyermainpage from "./pages/customer/buyermainpage";
import CheckoutPage from "./pages/customer/checkout";
import CategoryPage from "./pages/customer/CategoryPage";
import BuyerOrders from "./pages/customer/buyerorders";
import BuyerProfile from "./pages/customer/buyerprofile";
import BuyerCart from "./pages/customer/buyercart";

// Simple placeholders for missing pages
const BuyerOrdersPlaceholder = () => <div style={{ padding: '100px', textAlign: 'center' }}><h1>My Orders</h1><p>Coming Soon!</p></div>;
const BuyerSupport = () => <div style={{ padding: '100px', textAlign: 'center' }}><h1>Customer Support</h1><p>Coming Soon!</p></div>;
const BuyerPrescriptions = () => <div style={{ padding: '100px', textAlign: 'center' }}><h1>Upload Prescription</h1><p>Coming Soon!</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route - Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Customer/Buyer Routes */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/register" element={<BuyerRegister />} />
        <Route path="/buyer/dashboard" element={<Buyermainpage />} />
        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute redirectPath="/buyer/login" tokenKey="customer_token" />}>
          <Route path="/buyer/checkout" element={<CheckoutPage />} />
          <Route path="/buyer/wishlist" element={<BuyerWishlist />} />
          <Route path="/buyer/cart" element={<BuyerCart />} />
          <Route path="/buyer/profile" element={<BuyerProfile />} />
          <Route path="/buyer/orders" element={<BuyerOrders />} />
        </Route>

        <Route path="/buyer/category/:categoryId/:categoryName?" element={<CategoryPage />} />
        <Route path="/buyer/support" element={<BuyerSupport />} />
        <Route path="/buyer/prescriptions" element={<BuyerPrescriptions />} />

        {/* Public Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/setup/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPass />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/notifications" element={<AdminNotification />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/buyers" element={<AdminBuyer />} />
          <Route path="/admin/sellers" element={<AdminSeller />} />
          <Route path="/admin/products" element={<AdminProduct />} />
          <Route path="/admin/orders" element={<AdminOrder />} />
          <Route path="/admin/reports" element={<AdminReport />} />
          <Route path="/admin/settings" element={<AdminSetting />} />
          <Route path="/admin/suppliers" element={<AdminSupplier />} />
          <Route path="/admin/categories" element={<AdminCategory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
