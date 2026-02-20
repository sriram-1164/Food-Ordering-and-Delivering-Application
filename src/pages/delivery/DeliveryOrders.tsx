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
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Avatar,
  IconButton,
   Grid,
} from "@mui/material";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";
import { useNavigate } from "react-router-dom";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import NavigationIcon from "@mui/icons-material/Navigation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";

const crud = CrudService();

const DeliveryOrders = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");

  const loggedUser: UserDetails = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    const data = await crud.getOrders();
    const filtered = data.filter(
      (order) => order.deliveryPartnerId === loggedUser.id && order.status !== "Delivered"
    );
    setOrders(filtered);
  };

  const handleReached = async (order: OrderDetails) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    await crud.updateOrder(order.id, {
      deliveryOtp: otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      status: "Reached",
    });
    setSnackbar({ open: true, message: "OTP Generated! Ready for verification.", severity: "success" });
    loadOrders();
  };

  const handleVerifyOtp = async () => {
    if (!selectedOrder) return;
    if (Number(enteredOtp) !== selectedOrder.deliveryOtp) {
      setSnackbar({ open: true, message: "Invalid OTP", severity: "error" });
      return;
    }
    await crud.updateOrder(selectedOrder.id, { status: "Delivered", deliveryOtp: undefined, otpExpiry: undefined });
    await crud.updateUser(loggedUser.id, { isBusy: false });
    setSnackbar({ open: true, message: "Order Delivered!", severity: "success" });
    setOtpDialogOpen(false);
    setEnteredOtp("");
    setSelectedOrder(null);
    loadOrders();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // 🔥 STUNNING BACKGROUND REMAINS
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=2015&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        pt: 10, pb: 5, px: 2,
      }}
    >
      <Box sx={{ position: "absolute", top: 25, left: 25 }}><BackButton to="/delivery" /></Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper
          elevation={0}
          sx={{
            width: "100%", maxWidth: 850, borderRadius: 6, p: 4, mb: 4, textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography variant="h3" fontWeight="900" sx={{ color: "#00d2ff", textShadow: "0 0 20px rgba(0,210,255,0.5)" }}>
            LIVE MISSIONS
          </Typography>
          <Typography sx={{ color: "#fff", mt: 1, fontWeight: "500", opacity: 0.9 }}>
            "Speed is good, but safety and accuracy are legendary." 🏁
          </Typography>
        </Paper>

        {orders.length === 0 ? (
          <Typography variant="h5" sx={{ color: "white", mt: 10 }}>Waiting for new orders... 📦</Typography>
        ) : (
          <Stack spacing={4} sx={{ width: "100%", maxWidth: 850 }}>
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  background: "rgba(255, 255, 255, 0.95)",
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.01)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }
                }}
              >
                {/* 🔥 FIXED: NO BROKEN IMAGE. REPLACED WITH SLEEK ICON SIDEBAR */}
                <Box
                  sx={{
                    width: { xs: "100%", sm: 120 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    color: "#00d2ff"
                  }}
                >
                  <DeliveryDiningIcon sx={{ fontSize: 60 }} />
                </Box>

                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight="900" color="#1a1a2e">{order.username}</Typography>
                    <Typography variant="h5" fontWeight="900" color="#1a1a2e">{order.foodname}</Typography>
                    <Chip 
                        label={order.status} 
                        color={order.status === "Reached" ? "success" : "error"} 
                        variant="filled" 
                        sx={{ fontWeight: "bold" }} 
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 24, height: 24, bgcolor: "#00d2ff" }}><MyLocationIcon sx={{ fontSize: 16 }} /></Avatar>
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                {order.address.addressLine}, {order.address.city}
                            </Typography>
                        </Stack>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" gap={2} flexWrap="wrap">
                    {order.status === "Reached" ? (
                      <Button variant="contained" onClick={() => { setSelectedOrder(order); setOtpDialogOpen(true); }}
                        sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" }, borderRadius: 3, px: 3, fontWeight: 'bold' }}>
                        VERIFY OTP
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={() => handleReached(order)}
                        sx={{ bgcolor: "#ff9100", "&:hover": { bgcolor: "#ff6d00" }, borderRadius: 3, px: 3, fontWeight: 'bold' }}>
                        REACHED LOCATION
                      </Button>
                    )}
                    <IconButton 
                        href={`tel:${order.phonenumber}`} 
                        sx={{ color: "#1a1a2e", border: "1px solid #ddd", borderRadius: 3 }}
                    >
                        <PhoneInTalkIcon />
                    </IconButton>
                    <Button 
                      variant="outlined" 
                      startIcon={<NavigationIcon />} 
                      onClick={() => navigate(`/delivery/track/${order.id}`)}
                      sx={{ borderRadius: 3, color: "#1a1a2e", borderColor: "#1a1a2e", fontWeight: 'bold' }}
                    >
                      TRACK
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)} PaperProps={{ sx: { borderRadius: 5 } }}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Delivery Verification</DialogTitle>
        <DialogContent>
            <TextField 
                fullWidth 
                label="Enter 4-Digit OTP" 
                value={enteredOtp} 
                onChange={(e) => setEnteredOtp(e.target.value)} 
                margin="normal" 
                type="number"
            />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleVerifyOtp} sx={{ bgcolor: "#2e7d32" }}>Verify & Complete</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DeliveryOrders;