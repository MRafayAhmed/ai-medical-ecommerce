import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/admin/adminlogin";
import AdminRegister from "./pages/admin/adminregister";
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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route - Redirect to Admin Login */}
        <Route path="/" element={<AdminLogin />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPass />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/notifications" element={<AdminNotification />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/buyers" element={<AdminBuyer />} />
        <Route path="/admin/sellers" element={<AdminSeller />} />
        <Route path="/admin/products" element={<AdminProduct />} />
        <Route path="/admin/orders" element={<AdminOrder />} />
        <Route path="/admin/reports" element={<AdminReport />} />
        <Route path="/admin/settings" element={<AdminSetting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
