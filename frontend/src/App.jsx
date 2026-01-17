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
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerLogin from "./pages/customer/login";
import CustomerRegister from "./pages/customer/register";
import CustomerDashboard from "./pages/customer/dashboard";
import CheckoutPage from "./pages/customer/checkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route - Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Customer Routes */}
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/checkout" element={<CheckoutPage />} />

        {/* Public Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
