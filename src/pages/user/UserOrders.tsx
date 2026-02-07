import {
  Typography,
  Box,
  
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrudService } from "../../services/CrudService";
import Loader from "../../components/common/Loader";
import OrdersTable from "../../components/orders/OrdersTable";
import BackButton from "../../components/common/BackButton";
import CancelOrderDialog from "../../pages/user/CancelOrderDialog";
import { OrderDetails } from "../../services/Model";
import FeedbackDialog from "./FeedbackDialog";
import { order } from "@mui/system";

export default function UserOrders() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // cancel order states
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

  // const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState<OrderDetails | null>(null);

  const handleGiveFeedback = (order: OrderDetails) => {
    setFeedbackOrder(order);
    setFeedbackOpen(true);
  };
 
  // LOAD USER ORDERS
  const loadOrders = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/");
      return;
    }

    const user = JSON.parse(userStr);

    crud.getOrders().then((res: any[]) => {
      const safeOrders = Array.isArray(res) ? res : [];

      const userOrders = safeOrders.filter(
        (o) => String(o.userId) === String(user.userId)
      );

      setOrders(userOrders);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // WHEN USER CLICKS CANCEL
  const handleCancelClick = (order: OrderDetails) => {
    setSelectedOrder(order);
    setCancelOpen(true);
  };

  // CONFIRM CANCEL
  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;

    await crud.updateOrder(selectedOrder.id, {
      status: "Cancelled",
    });

    setCancelOpen(false);
    setSelectedOrder(null);
    loadOrders(); // refresh orders
  };

 const sortedUserOrders = [...orders]
  .filter(o => o.status !== "Cancelled")
  .sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // 🔥 latest first
  });


  if (loading) return <Loader />;

  return (
    <><Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
      }}
    >
      {/* BACK BUTTON */}
      <Box mb={2}>
        <BackButton to="/usermenu" />
      </Box>

      {/* TITLE */}
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        mb={3}
        sx={{
          background: "linear-gradient(135deg, #ff5722, #ff9800)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        My Orders
      </Typography>

      {/* ORDERS TABLE */}
      <Box
        p={2}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <OrdersTable
          orders={sortedUserOrders}
          admin={false}
          onCancelOrder={handleCancelClick}
          onGiveFeedback={handleGiveFeedback} />
      </Box>

      {/* CANCEL CONFIRMATION DIALOG */}
      <CancelOrderDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancelOrder} />
    </Box><FeedbackDialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        order={feedbackOrder} /></>

  );
}
