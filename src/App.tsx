import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserMenu from "./pages/user/UserMenu";
import UserOrders from "./pages/user/UserOrders";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage";
import AdminSalesReport from "./pages/admin/AdminSalesReport"






export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/usermenu" element={<UserMenu />} />
        <Route path="/userorders" element={<UserOrders />} />
        
        <Route path="/adminmenu" element={<AdminMenu />} />
        <Route path="/adminorders" element={<AdminOrders />} />
        <Route path="/adminfeedback" element={<AdminFeedbackPage />} />
        <Route path="/admin/reports" element={<AdminSalesReport />} />

      </Routes>
    </BrowserRouter>
  );
}
