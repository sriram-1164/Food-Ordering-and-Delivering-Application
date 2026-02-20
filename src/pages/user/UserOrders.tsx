import {
  Typography,
  Box,
  Tab,
  Tabs,
  Paper,
  Container,
  Stack,
  Chip,
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
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function UserOrders() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

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
    await crud.updateOrder(selectedOrder.id, { status: "Cancelled" });
    setCancelOpen(false);
    setSelectedOrder(null);
    loadOrders();
  };

  const activeOrders = orders.filter(
    (o) => o.status === "Preparing" || o.status === "OutforDelivery" || o.status === "Reached"
  );

  const historyOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Cancelled"
  );

  const sortByDate = (list: OrderDetails[]) =>
    [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
        pb: 8
      }}
    >
      {/* TOP NAVIGATION SPACE */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <BackButton to="/usermenu" gradient="linear-gradient(135deg, #ff5722, #ff9800)" />
      </Box>

      <Container maxWidth="lg">
        {/* HEADER SECTION */}
        <Stack direction="column" alignItems="center" spacing={1} mb={4}>
          <Typography
            variant="h3"
            fontWeight="900"
            sx={{
              background: "linear-gradient(135deg, #601600, #ff5722)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center"
            }}
          >
            My Orders
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep track of your delicious meals
          </Typography>
        </Stack>

        {/* CUSTOM TABS DESIGN */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            centered
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              bgcolor: 'rgba(255,255,255,0.5)',
              p: 1,
              borderRadius: "50px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: '1px solid #fff',
              "& .MuiTabs-flexContainer": { gap: 1 },
            }}
          >
            <Tab
              icon={<LocalShippingIcon fontSize="small" />}
              iconPosition="start"
              label={`Active (${activeOrders.length})`}
              sx={{
                textTransform: "none",
                fontWeight: "900",
                px: 3,
                borderRadius: "40px",
                transition: "0.3s",
                minHeight: '45px',
                color: '#ff5722',
                "&.Mui-selected": {
                  bgcolor: "#ff5722",
                  color: "#fff",
                },
              }}
            />
            <Tab
              icon={<HistoryIcon fontSize="small" />}
              iconPosition="start"
              label={`History (${historyOrders.length})`}
              sx={{
                textTransform: "none",
                fontWeight: "900",
                px: 3,
                borderRadius: "40px",
                transition: "0.3s",
                minHeight: '45px',
                color: '#ff5722',
                "&.Mui-selected": {
                  bgcolor: "#ff5722",
                  color: "#fff",
                },
              }}
            />
          </Tabs>
        </Box>

        {/* TABLE CONTAINER */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1, md: 3 },
            borderRadius: 5,
            bgcolor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
            overflow: "hidden"
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <Chip 
              label={tab === 0 ? "Real-time Tracking" : "Past Records"} 
              size="small" 
              sx={{ bgcolor: '#ff5722', color: '#fff', fontWeight: 'bold' }} 
            />
          </Box>
          
          <OrdersTable
            orders={tab === 0 ? sortByDate(activeOrders) : sortByDate(historyOrders)}
            admin={false}
            onCancelOrder={tab === 0 ? handleCancelClick : undefined}
            onGiveFeedback={tab === 1 ? handleGiveFeedback : undefined}
          />

          {/* EMPTY STATE */}
          {(tab === 0 ? activeOrders : historyOrders).length === 0 && (
            <Box textAlign="center" py={10}>
              <Typography variant="h6" color="text.secondary">
                No orders found here yet! 🍕
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ready to eat something great?
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      {/* DIALOGS */}
      <CancelOrderDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={confirmCancelOrder}
      />
      
      <FeedbackDialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        order={feedbackOrder}
      />
    </Box>
  );
}