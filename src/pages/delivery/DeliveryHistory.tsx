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
} from "@mui/material";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";

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
        background: "linear-gradient(135deg, #141e30, #243b55)",
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
          maxWidth: 950,
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
          mb={3}
        >
          📦 Delivery History
        </Typography>

        {/* SUMMARY SECTION */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexWrap="wrap"
          gap={2}
        >
          <Chip
            label={`Total Delivered: ${orders.length}`}
            color="primary"
            sx={{ fontSize: 16, p: 2 }}
          />

          <Chip
            label={`Total Earnings: ₹${totalEarnings}`}
            color="success"
            sx={{ fontSize: 16, p: 2 }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* HISTORY LIST */}
        {orders.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No completed deliveries yet.
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
                  <Typography variant="h6" fontWeight="bold">
                    {order.foodname}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Typography>
                    <strong>Customer:</strong> {order.username}
                  </Typography>

                  <Typography>
                    <strong>Quantity:</strong> {order.quantity}
                  </Typography>

                  <Typography>
                    <strong>Total:</strong> ₹
                    {order.price * order.quantity}
                  </Typography>

                  <Typography mt={1}>
                    <strong>Delivered On:</strong>{" "}
                    {new Date(order.date).toLocaleString()}
                  </Typography>

                  <Chip
                    label="Completed"
                    color="success"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default DeliveryHistory;
