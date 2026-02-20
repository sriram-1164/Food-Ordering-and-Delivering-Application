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
  Avatar,
  IconButton,
  Grid,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import StarsIcon from "@mui/icons-material/Stars";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";
import "../../index.css";

const crud = CrudService();

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [isOnline, setIsOnline] = useState(loggedUser?.isOnline ?? false);

  const quotes = [
    "You're not just delivering food, you're delivering happiness! ✨",
    "Fueling the city's hunger, one ride at a time. 🚀",
    "Your hard work is the secret ingredient to our success! 🍕",
    "Ride safe, stay bold, and keep crushing your goals! 🏁",
  ];
  const [randomQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

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

  const activeOrders = orders.filter((o) => o.status !== "Delivered").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;

  useEffect(() => {
    if (!loggedUser?.id) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await crud.updateUser(loggedUser.id, { currentLocation: { lat, lng } });
      },
      (error) => console.log("Location Error:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleLogout = async () => {
    try {
      await crud.updateUser(loggedUser.id, { isOnline: false });
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1100, display: "flex", justifyContent: "space-between", mb: 3, px: 2 }}>
        <Typography variant="h6" sx={{ color: "#00d2ff", fontWeight: "bold", letterSpacing: 2 }}>
            QUICKCRAVINGS PARTNER
        </Typography>
        <IconButton 
            onClick={() => setLogoutOpen(true)}
            sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "#ff5252", "&:hover": { bgcolor: "#ff5252", color: "#fff" } }}
          >
            <LogoutIcon />
        </IconButton>
      </Box>

      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: 1100,
          position: "relative",
          borderRadius: 10,
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                backgroundImage: `url('https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?q=80&w=2098&auto=format&fit=crop')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.15,
                filter: "grayscale(50%)",
            }}
        />

        <Box sx={{ p: { xs: 4, md: 7 }, position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Avatar 
                    sx={{ width: 70, height: 70, bgcolor: "#ff5722", fontSize: "2rem", fontWeight: "bold" }}
                >
                    {loggedUser.username?.charAt(0)}
                </Avatar>
                <Typography variant="h2" sx={{ color: "#fff", fontWeight: 900, lineHeight: 1 }}>
                    Ride on, <br/> 
                    <span style={{ color: "#00d2ff" }}>{loggedUser.username}!</span>
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem" }}>
                    {randomQuote}
                </Typography>
                
                <Box sx={{ pt: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isOnline}
                                onChange={async (e) => {
                                    const value = e.target.checked;
                                    setIsOnline(value);
                                    await crud.updateUser(loggedUser.id, { isOnline: value });
                                    localStorage.setItem("user", JSON.stringify({ ...loggedUser, isOnline: value }));
                                }}
                                color="success"
                            />
                        }
                        label={
                            <Typography sx={{ color: isOnline ? "#4caf50" : "#f44336", fontWeight: "bold", ml: 1 }}>
                                {isOnline ? "YOU ARE CURRENTLY ACTIVE" : "YOU ARE CURRENTLY OFFLINE"}
                            </Typography>
                        }
                    />
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Card sx={{ 
                    borderRadius: 5, 
                    background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
                    color: "#fff", p: 1
                  }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Total Assigned</Typography>
                            <Typography variant="h4" fontWeight="bold">{orders.length}</Typography>
                        </Box>
                        <LocalMallIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Card 
                    onClick={() => navigate("/delivery/orders")}
                    sx={{ 
                        borderRadius: 5, cursor: "pointer",
                        background: "rgba(255,255,255,0.05)", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff", transition: "0.3s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                        <WhatshotIcon sx={{ color: "#ffa726", mb: 1 }} />
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>Active</Typography>
                        <Typography variant="h5" fontWeight="bold">{activeOrders}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Card 
                    onClick={() => navigate("/delivery/history")}
                    sx={{ 
                        borderRadius: 5, cursor: "pointer",
                        background: "rgba(255,255,255,0.05)", 
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#fff", transition: "0.3s", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                        <CheckCircleIcon sx={{ color: "#66bb6a", mb: 1 }} />
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>Done</Typography>
                        <Typography variant="h5" fontWeight="bold">{completedOrders}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 6 }}>
             <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<DirectionsBikeIcon />}
                onClick={() => navigate("/delivery/orders")}
                sx={{
                  py: 2, borderRadius: 5, fontWeight: "bold", fontSize: "1.2rem",
                  background: "linear-gradient(45deg, #ff5722 30%, #ff8a65 90%)",
                  boxShadow: "0 10px 30px rgba(255, 87, 34, 0.4)",
                  "&:hover": { background: "#e64a19" }
                }}
              >
                GO TO LIVE ORDERS
              </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Finish for the day?</DialogTitle>
        <DialogContent>
          <DialogContentText>You'll be set to offline. Great work today!</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setLogoutOpen(false)} color="inherit">Not yet</Button>
          <Button onClick={handleLogout} variant="contained" color="error" sx={{ borderRadius: 3 }}>Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryDashboard;