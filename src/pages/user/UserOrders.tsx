import {
  Typography,
  Box,
  Tab,
  Tabs,

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


export default function UserOrders() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  // cancel order states
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState<OrderDetails | null>(null);

  const handleGiveFeedback = (order: OrderDetails) => {
    setFeedbackOrder(order);
    setFeedbackOpen(true);
  };

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

  const handleCancelClick = (order: OrderDetails) => {
    setSelectedOrder(order);
    setCancelOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;

    await crud.updateOrder(selectedOrder.id, {
      status: "Cancelled",
    });

    setCancelOpen(false);
    setSelectedOrder(null);
    loadOrders(); // refresh orders
  };

  const activeOrders = orders.filter(
    (o) => o.status === "Preparing"
  );

  const historyOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Cancelled"
  );

  const sortByDate = (list: OrderDetails[]) =>
    [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );


  if (loading) return <Loader />;

  return (
    <><Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
      }}
    >
      <Box mb={2}>
        <BackButton to="/usermenu" />
      </Box>

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


      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        centered
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          mb: 3,
          "& .MuiTabs-flexContainer": {
            gap: 2,
          },
        }}
      >
        <Tab
          label={`Active Orders (${activeOrders.length})`}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            py: 1.2,
            borderRadius: "30px",
            bgcolor: tab === 0 ? "#ff5722" : "#fff",
            color: tab === 0 ? "#fff" : "#ff5722",
            border: "2px solid #ff5722",
            transition: "0.3s",
            "&.Mui-selected": {
              color: "#fff",   
            },
            "&:hover": {
              bgcolor: tab === 0 ? "#e64a19" : "#fff3e0",
            },
          }}
        />

        <Tab
          label={`Order History (${historyOrders.length})`}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            px: 4,
            py: 1.2,
            borderRadius: "30px",
            bgcolor: tab === 1 ? "#ff5722" : "#fff",
            color: tab === 1 ? "#fff" : "#ff5722",
            border: "2px solid #ff5722",
            transition: "0.3s",
            "&.Mui-selected": {
              color: "#fff",  
            },
            "&:hover": {
              bgcolor: tab === 1 ? "#e64a19" : "#fff3e0",
            },
          }}
        />
      </Tabs>

      <Box
        p={2}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <OrdersTable
          orders={
            tab === 0
              ? sortByDate(activeOrders)
              : sortByDate(historyOrders)
          }
          admin={false}
          onCancelOrder={tab === 0 ? handleCancelClick : undefined}
          onGiveFeedback={tab === 1 ? handleGiveFeedback : undefined}
        />
      </Box>

      <CancelOrderDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancelOrder} />
    </Box>
    <FeedbackDialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        order={feedbackOrder} /></>

  );
}
