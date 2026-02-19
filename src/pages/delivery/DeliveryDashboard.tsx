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
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";

const crud = CrudService();

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [isOnline, setIsOnline] = useState(
    loggedUser?.isOnline ?? false
  );

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
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

  // 🔥 Save initial location once
  useEffect(() => {
    if (!loggedUser?.id) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        await crud.updateUser(loggedUser.id, {
          currentLocation: { lat, lng },
        });

        console.log("📍 Initial Location Saved:", lat, lng);
      },
      (error) => console.log("Initial Location Error:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // 🔴 LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      // Set user offline in DB
      await crud.updateUser(loggedUser.id, {
        isOnline: false,
      });

      // Clear local storage
      localStorage.removeItem("user");

      // Redirect to login
      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
         position: "relative",
      }}
    >
      {/* 🔴 LOGOUT BUTTON TOP RIGHT */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={() => setLogoutOpen(true)}
          sx={{
            borderRadius: 3,
            px: 3,
          }}
        >
          Logout
        </Button>
      </Box>
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
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Welcome, {loggedUser.username} 👋
          </Typography>
          <Typography color="text.secondary">
            Delivery Dashboard
          </Typography>
        </Box>

        <Stack direction="row" spacing={3} mb={4}>
          <Card
            sx={{
              flex: 1,
              cursor: "pointer",
              borderRadius: 3,
              background: "linear-gradient(135deg, #42a5f5, #478ed1)",
              color: "#fff",
              "&:hover": { transform: "scale(1.05)" },
            }}
            // onClick={() => navigate("/delivery/orders")}
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

        <Box textAlign="center">
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
      </Paper>

       {/* 🔥 LOGOUT CONFIRMATION DIALOG */}
      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout? You will be marked as
            offline.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setLogoutOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryDashboard;
