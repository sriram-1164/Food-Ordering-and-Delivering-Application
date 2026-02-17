import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserMenu from "./pages/user/UserMenu";
import UserOrders from "./pages/user/UserOrders";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminFeedbackPage from "./pages/admin/AdminFeedbackPage";
import AdminSalesReport from "./pages/admin/AdminSalesReport"
import UserProfile from "./pages/user/UserProfile";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryOrders from "./pages/delivery/DeliveryOrders";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import AddDelivery from "./pages/admin/AddDelivery";
import TrackOrder from "./pages/delivery/TrackOrder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/usermenu" element={<UserMenu />} />
        <Route path="/userorders" element={<UserOrders />} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path="/adminmenu" element={<AdminMenu />} />
        <Route path="/adminorders" element={<AdminOrders />} />
        <Route path="/adminfeedback" element={<AdminFeedbackPage />} />
        <Route path="/admin/reports" element={<AdminSalesReport />} />
        <Route path="/adminadddelivery" element={<AddDelivery />} />

        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/delivery/orders" element={<DeliveryOrders />} />
        <Route path="/delivery/history" element={<DeliveryHistory />} />
        <Route path="/track/:id" element={<TrackOrder />} />



      </Routes>
    </BrowserRouter>
  );
}
