import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Paper,
  Divider,
} from "@mui/material";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";
import { useNavigate } from "react-router-dom";

const crud = CrudService();

const DeliveryOrders = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
  const navigate = useNavigate();
  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    const data = await crud.getOrders();
    const filtered = data.filter(
      (order) =>
        order.deliveryPartnerId === loggedUser.id &&
        order.status !== "Delivered"
    );
    setOrders(filtered);
  };

  const handleDelivered = async (id: string) => {
    await crud.updateOrder(id, { status: "Delivered" });

    await crud.updateUser(loggedUser.id, {
      isBusy: false,
    });

    loadOrders();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        position: "relative", // 🔥 IMPORTANT
      }}
    >

      {/* 🔥 BACK BUTTON TOP LEFT */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
      >
        <BackButton to="/delivery" />
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 4,
            p: 4,
            background: "rgba(255,255,255,0.95)",
          }}
        >
          {/* HEADER */}
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={4}
          >
            🚚 Assigned Orders
          </Typography>

          {orders.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              No active deliveries right now.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {orders.map((order) => (
                <Card
                  key={order.id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: 4,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent>
                    {/* FOOD TITLE */}
                    <Typography variant="h6" fontWeight="bold">
                      {order.foodname}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {/* ORDER DETAILS */}
                    <Typography>
                      <strong>Customer:</strong> {order.username}
                    </Typography>

                    <Typography>
                      <strong>Phone:</strong> {order.phonenumber}
                    </Typography>

                    <Typography mt={1}>
                      <strong>Address:</strong><br />
                      {order.address.addressLine},<br />
                      {order.address.city} - {order.address.pincode}
                    </Typography>

                    <Chip
                      label={order.status}
                      sx={{ mt: 2 }}
                      color="warning"
                    />

                    {/* ACTION BUTTONS */}
                    <Box
                      mt={3}
                      display="flex"
                      flexWrap="wrap"
                      gap={2}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          handleDelivered(order.id)
                        }
                        sx={{
                          borderRadius: 3,
                          px: 3,
                        }}
                      >
                        Mark Delivered
                      </Button>

                      <Button
                        variant="outlined"
                        href={`tel:${order.phonenumber}`}
                        sx={{
                          borderRadius: 3,
                          px: 3,
                        }}
                      >
                        Call Customer
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/delivery/track/${order.id}`)}

                      >
                        Open Tracker
                      </Button>

                    </Box>
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

export default DeliveryOrders;
