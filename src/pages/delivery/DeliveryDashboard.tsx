import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";

const crud = CrudService();

const DeliveryDashboard = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDetails[]>([]);

  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [isOnline, setIsOnline] = useState(loggedUser.isOnline || false);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    const data = await crud.getOrders();
    const filtered = data.filter(
      (order) => order.deliveryPartnerId === loggedUser.id
    );
    setOrders(filtered);
  };

  const activeOrders = orders.filter(
    (o) => o.status !== "Delivered"
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;


  useEffect(() => {
  if (!isOnline) return;

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      await crud.updateUser(loggedUser.id, {
        currentLocation: {
          lat: latitude,
          lng: longitude,
        },
      });
    },
    (error) => console.log(error),
    { enableHighAccuracy: true }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, [isOnline]);


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "90%",
          maxWidth: 900,
          p: 5,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.95)",
        }}
      >
        {/* HEADER */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Welcome, {loggedUser.username} 👋
          </Typography>
          <Typography color="text.secondary">
            Delivery Dashboard
          </Typography>
        </Box>

        {/* STAT CARDS */}
        <Stack direction="row" spacing={3} mb={4}>
          <Card
            sx={{
              flex: 1,
              cursor: "pointer",
              borderRadius: 3,
              background: "linear-gradient(135deg, #42a5f5, #478ed1)",
              color: "#fff",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => navigate("/delivery/orders")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography>Total Assigned</Typography>
              <Typography variant="h3" fontWeight="bold">
                {orders.length}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              cursor: "pointer",
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffa726, #fb8c00)",
              color: "#fff",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => navigate("/delivery/orders")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography>Active Orders</Typography>
              <Typography variant="h3" fontWeight="bold">
                {activeOrders}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              cursor: "pointer",
              borderRadius: 3,
              background: "linear-gradient(135deg, #66bb6a, #43a047)",
              color: "#fff",
              transition: "0.3s",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => navigate("/delivery/history")}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography>Completed</Typography>
              <Typography variant="h3" fontWeight="bold">
                {completedOrders}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* ONLINE SWITCH */}
        <Box textAlign="center" mb={4}>
          <FormControlLabel
            control={
              <Switch
                checked={isOnline}
                onChange={async (e) => {
                  const value = e.target.checked;
                  setIsOnline(value);

                  await crud.updateUser(loggedUser.id, {
                    isOnline: value,
                  });

                  localStorage.setItem(
                    "user",
                    JSON.stringify({ ...loggedUser, isOnline: value })
                  );
                }}
                color="success"
              />
            }
            label={
              <Typography fontWeight="bold">
                {isOnline ? "🟢 Online" : "🔴 Offline"}
              </Typography>
            }
          />
        </Box>

        {/* NAVIGATION BUTTONS */}
        <Stack direction="row" spacing={3} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              background: "linear-gradient(135deg, #1e88e5, #1565c0)",
            }}
            onClick={() => navigate("/delivery/orders")}
          >
            View Assigned Orders
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              borderColor: "#1e88e5",
              color: "#1e88e5",
            }}
            onClick={() => navigate("/delivery/history")}
          >
            View Delivery History
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DeliveryDashboard;
