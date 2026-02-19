import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Drawer,
  IconButton,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CrudService } from "../../services/CrudService";
import { UserDetails, OrderDetails } from "../../services/Model";
import Grid from "@mui/material/Grid";
import BackButton from "../../components/common/BackButton";


const crud = CrudService();

const DeliveryMonitoring = () => {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const u = await crud.getUsers();
    const o = await crud.getOrders();

    setUsers(u.filter((user) => user.role === "delivery"));
    setOrders(o);
  };

  const onlineCount = users.filter((u) => u.isOnline).length;
  const busyCount = users.filter((u) => u.isBusy).length;

  const getDeliveredCount = (userId: number) =>
    orders.filter(
      (o) =>
        o.deliveryPartnerId === userId &&
        o.status === "Delivered"
    ).length;

  const getActiveOrders = (userId: number) =>
    orders.filter(
      (o) =>
        o.deliveryPartnerId === userId &&
        o.status !== "Delivered" &&
        o.status !== "Cancelled"
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        position: "relative",
      }}
    >
          <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
      >
        <BackButton to="/adminorders" />
      </Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color="#fff"
      >
        🚚 Delivery Monitoring Dashboard
      </Typography>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3} mb={5}>
        <Grid  size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" textAlign="center">Online Partners</Typography>
              <Typography variant="h3" color="success.main" fontWeight="bold" textAlign="center">
                {onlineCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid  size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" textAlign="center">Busy Partners</Typography>
              <Typography variant="h3" color="warning.main" fontWeight="bold" textAlign="center">
                {busyCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid  size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" textAlign="center">Total Delivery Partners</Typography>
              <Typography variant="h3" color="primary.main" fontWeight="bold" textAlign="center">
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* DELIVERY CARDS */}
      <Grid container spacing={3}>
        {users.map((user) => {
          const delivered = getDeliveredCount(user.id);
          const activeOrders = getActiveOrders(user.id);

          return (
            <Grid  size={{ xs: 12, md: 4 }} key={user.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.03)" },
                }}
                onClick={() => setSelectedUser(user)}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box fontWeight="bold" textAlign="center">
                      <Typography fontWeight="bold">
                        {user.username}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Chip
                          label={
                            user.isOnline ? "Online" : "Offline"
                          }
                          color={
                            user.isOnline ? "success" : "default"
                          }
                          size="small"
                        />
                        <Chip
                          label={
                            user.isBusy ? "Busy" : "Free"
                          }
                          color={
                            user.isBusy ? "warning" : "info"
                          }
                          size="small"
                        />
                      </Stack>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography>
                    📦 Active Orders: {activeOrders.length}
                  </Typography>
                  <Typography>
                    ✅ Delivered: {delivered}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* RIGHT SIDE DRAWER */}
      <Drawer
        anchor="right"
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      
      >
        <Box sx={{background: "linear-gradient(135deg, #d3db64, #eceed0)",width:"full"}} >
        {selectedUser && (
          <Box sx={{ width: 400, p: 3, }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">
                {selectedUser.username}
              </Typography>
              <IconButton
                onClick={() => setSelectedUser(null)}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography>
              Status:{" "}
              <Chip
                label={
                  selectedUser.isOnline
                    ? "Online"
                    : "Offline"
                }
                color={
                  selectedUser.isOnline
                    ? "success"
                    : "default"
                }
                size="small"
              />
            </Typography>

            <Typography mt={2}>
              Busy:{" "}
              <Chip
                label={
                  selectedUser.isBusy ? "Busy" : "Free"
                }
                color={
                  selectedUser.isBusy
                    ? "warning"
                    : "info"
                }
                size="small"
              />
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography fontWeight="bold" mb={1}>
              Active Orders
            </Typography>

            {getActiveOrders(selectedUser.id).length === 0 ? (
              <Typography>No active orders</Typography>
            ) : (
              getActiveOrders(selectedUser.id).map((o) => (
                <Paper
                  key={o.id}
                  sx={{ p: 2, mb: 2, borderRadius: 2 }}
                >
                  <Typography>
                    🍽 {o.foodname}
                  </Typography>
                  <Typography fontSize={13}>
                    {o.username}
                  </Typography>
                  <Chip
                    label={o.status}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Paper>
              ))
            )}

            <Divider sx={{ my: 3 }} />

            <Typography>
              Total Delivered:{" "}
              {getDeliveredCount(selectedUser.id)}
            </Typography>

            {selectedUser.currentLocation && (
              <Typography mt={2} fontSize={13}>
                📍 Lat:{" "}
                {selectedUser.currentLocation.lat}
                <br />
                📍 Lng:{" "}
                {selectedUser.currentLocation.lng}
              </Typography>
            )}

          </Box>
          
        )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default DeliveryMonitoring;
