import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Paper,
  Divider,
  Chip,
  Avatar,
   Grid,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import PaidIcon from "@mui/icons-material/Paid";
import VerifiedIcon from "@mui/icons-material/Verified";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";

const crud = CrudService();

const DeliveryHistory = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await crud.getOrders();
    const filtered = data.filter(
      (order) =>
        order.deliveryPartnerId === loggedUser.id &&
        order.status === "Delivered"
    );
    setOrders(filtered);
  };

  // 🔥 Calculate earnings
  const totalEarnings = orders.reduce(
    (acc, order) => acc + order.price * order.quantity,
    0
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        position: "relative",
        pb: 10,
      }}
    >
      {/* --- BACK BUTTON --- */}
      <Box sx={{ position: "absolute", top: 25, left: 25, zIndex: 10 }}>
        <BackButton to="/delivery" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 10,
          px: { xs: 2, md: 4 },
        }}
      >
        {/* HEADER & MOTIVATION */}
        <Box textAlign="center" mb={5} sx={{ color: "#fff" }}>
          <EmojiEventsIcon sx={{ fontSize: 50, color: "#FFD700", mb: 1 }} />
          <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: -1 }}>
            Your Achievements
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, fontStyle: "italic", maxWidth: 500, mx: "auto", mt: 1 }}>
            "Success is the sum of small efforts, repeated day in and day out. Great job today!"
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 1000,
            borderRadius: 8,
            p: { xs: 3, md: 5 },
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* SUMMARY CARDS */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 6,
                  textAlign: "center",
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                }}
              >
                <HistoryIcon sx={{ fontSize: 30, opacity: 0.8 }} />
                <Typography variant="h6" sx={{ opacity: 0.8 }}>Total Deliveries</Typography>
                <Typography variant="h3" fontWeight="900">{orders.length}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 6,
                  textAlign: "center",
                  background: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
                  color: "#fff",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                }}
              >
                <PaidIcon sx={{ fontSize: 30, opacity: 0.8 }} />
                <Typography variant="h6" sx={{ opacity: 0.8 }}>Total Earnings</Typography>
                <Typography variant="h3" fontWeight="900">₹{totalEarnings}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4, borderColor: "rgba(255,255,255,0.1)" }} />

          {/* HISTORY LIST */}
          {orders.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.5)" }}>
                No completed deliveries yet. Your journey starts here! 🏍️
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              {orders.map((order) => (
                <Card
                  key={order.id}
                  sx={{
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      background: "rgba(255,255,255,0.08)",
                      boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "#00d2ff", width: 50, height: 50 }}>
                          <RestaurantIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {order.foodname}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>
                            Order ID: #{order.id?.toString().slice(-6).toUpperCase()}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        icon={<VerifiedIcon style={{ color: "#fff" }} />}
                        label="Delivered"
                        sx={{ bgcolor: "#4caf50", color: "#fff", fontWeight: "bold" }}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 3 }}>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography sx={{ opacity: 0.6, fontSize: "0.8rem", textTransform: "uppercase" }}>Customer</Typography>
                        <Typography fontWeight="bold">{order.username}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography sx={{ opacity: 0.6, fontSize: "0.8rem", textTransform: "uppercase" }}>Quantity</Typography>
                        <Typography fontWeight="bold">{order.quantity} Units</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography sx={{ opacity: 0.6, fontSize: "0.8rem", textTransform: "uppercase" }}>Earnings</Typography>
                        <Typography fontWeight="900" sx={{ color: "#00d2ff" }}>₹{order.price * order.quantity}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                           <CalendarMonthIcon sx={{ fontSize: 16, opacity: 0.6 }} />
                           <Typography sx={{ opacity: 0.6, fontSize: "0.85rem" }}>
                             {new Date(order.date).toLocaleDateString()}
                           </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default DeliveryHistory;