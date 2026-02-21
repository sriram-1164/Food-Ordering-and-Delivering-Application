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
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { CrudService } from "../../services/CrudService";
import { UserDetails, OrderDetails } from "../../services/Model";
import Grid from "@mui/material/Grid"; 
import BackButton from "../../components/common/BackButton";
import { Dialog } from "@mui/material";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

const crud = CrudService();

const DeliveryMonitoring = () => {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);

  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
const [selectedRoute, setSelectedRoute] = useState<any[]>([]);

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

  // Logics (Untouched)
  const onlineCount = users.filter((u) => u.isOnline).length;
  const busyCount = users.filter((u) => u.isBusy).length;
  const getDeliveredCount = (userId: number) => orders.filter((o) => o.deliveryPartnerId === userId && o.status === "Delivered").length;
  const getActiveOrders = (userId: number) => orders.filter((o) => o.deliveryPartnerId === userId && o.status !== "Delivered" && o.status !== "Cancelled");
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.date).toDateString() === today);
  const preparingCount = todayOrders.filter((o) => o.status === "Preparing").length;
  const outForDeliveryCount = todayOrders.filter((o) => o.status === "OutforDelivery").length;
  const reachedCount = todayOrders.filter((o) => o.status === "Reached").length;
  const deliveredCount = todayOrders.filter((o) => o.status === "Delivered").length;
  const activeCount = preparingCount + outForDeliveryCount + reachedCount;


  function downloadKML(routeHistory: any[]) {
  const coordinates = routeHistory
    .map((p) => `${p.lng},${p.lat},0`)
    .join(" ");

  const kml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
      <Placemark>
        <LineString>
          <coordinates>
            ${coordinates}
          </coordinates>
        </LineString>
      </Placemark>
    </Document>
  </kml>`;

  const blob = new Blob([kml], {
    type: "application/vnd.google-earth.kml+xml"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "delivery-route.kml";
  link.click();
}

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      p: { xs: 2, md: 5 }, 
      background: "#f0f2f5", // Soft neutral background for high contrast
      color: "#1e293b"
    }}>
      
      {/* TOP NAVIGATION BAR */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <BackButton to="/adminorders" />
        <Box textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
                Delivery Console
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                Real-time fleet monitoring and order tracking
            </Typography>
        </Box>
        <Chip 
            label="Daily Statistics" 
            onClick={() => setOrderDrawerOpen(true)}
            sx={{ 
                bgcolor: "#0f172a", 
                color: "#fff", 
                fontWeight: "bold", 
                px: 2, py: 2.5,
                borderRadius: "10px",
                '&:hover': { bgcolor: "#334155" } 
            }} 
        />
      </Box>

      {/* STATS OVERVIEW SECTION */}
      <Grid container spacing={3} mb={5}>
        {[
          { label: "Online Partners", val: onlineCount, color: "#10b981", bg: "#ecfdf5" },
          { label: "Currently Busy", val: busyCount, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Total Fleet", val: users.length, color: "#3b82f6", bg: "#eff6ff" }
        ].map((stat, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: "16px", 
                textAlign: 'center', 
                border: `1px solid ${stat.color}20`,
                bgcolor: stat.bg
            }}>
              <Typography variant="subtitle2" sx={{ color: "#64748b", fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</Typography>
              <Typography variant="h3" sx={{ color: stat.color, fontWeight: 900, mt: 1 }}>{stat.val}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* LIVE PARTNER CARDS */}
      <Typography variant="h6" sx={{ color: "#1e293b", fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <DeliveryDiningIcon color="primary" /> Fleet Operations
      </Typography>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
            <Fade in={true} timeout={600}>
              <Card 
                onClick={() => setSelectedUser(user)}
                sx={{ 
                  borderRadius: "20px", 
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ 
                        width: 52, height: 52, 
                        bgcolor: "#f1f5f9", color: "#0f172a", 
                        fontWeight: "bold", border: "2px solid #e2e8f0" 
                    }}>
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a" }}>{user.username}</Typography>
                      <Stack direction="row" spacing={1} mt={0.5}>
                        <Chip 
                            size="small" 
                            icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important' }} />}
                            label={user.isOnline ? "Online" : "Offline"} 
                            sx={{ bgcolor: user.isOnline ? "#d1fae5" : "#f1f5f9", color: user.isOnline ? "#065f46" : "#64748b", fontWeight: 700 }} 
                        />
                        <Chip 
                            size="small" 
                            label={user.isBusy ? "Busy" : "Free"} 
                            sx={{ bgcolor: user.isBusy ? "#ffedd5" : "#e0f2fe", color: user.isBusy ? "#9a3412" : "#075985", fontWeight: 700 }} 
                        />
                      </Stack>
                    </Box>
                  </Stack>

                  <Box sx={{ mt: 3, p: 2, bgcolor: "#f8fafc", borderRadius: "12px" }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Box>
                            <Typography variant="caption" color="textSecondary" fontWeight={600}>ACTIVE ORDERS</Typography>
                            <Typography variant="h6" fontWeight={800}>{getActiveOrders(user.id).length}</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box textAlign="right">
                            <Typography variant="caption" color="textSecondary" fontWeight={600}>TOTAL DELIVERED</Typography>
                            <Typography variant="h6" fontWeight={800}>{getDeliveredCount(user.id)}</Typography>
                        </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* PARTNER DETAIL DRAWER */}
      <Drawer anchor="right" open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
        <Box sx={{ width: { xs: '100vw', sm: 400 }, p: 4, bgcolor: "#fff", height: '100%' }}>
          {selectedUser && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight={800}>Partner Profile</Typography>
                <IconButton onClick={() => setSelectedUser(null)}><CloseIcon /></IconButton>
              </Box>

              <Stack alignItems="center" spacing={1} mb={4}>
                <Avatar sx={{ width: 80, height: 80, fontSize: "2rem", bgcolor: "#0f172a" }}>{selectedUser.username?.charAt(0)}</Avatar>
                <Typography variant="h6" fontWeight={700}>{selectedUser.username}</Typography>
              </Stack>

              <Typography variant="subtitle2" sx={{ color: "#64748b", mb: 2, fontWeight: 700, textTransform: 'uppercase' }}>Active Tasks</Typography>
              {getActiveOrders(selectedUser.id).length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                    <Typography color="textSecondary">No active orders assigned</Typography>
                </Paper>
              ) : (
                getActiveOrders(selectedUser.id).map((o) => (
                  <Paper key={o.id} elevation={0} sx={{ p: 2, mb: 2, borderRadius: "12px", border: "1px solid #e2e8f0", bgcolor: "#fff" }}>
                    <Typography fontWeight={700} color="#0f172a">🍽 {o.foodname}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Client: {o.username}</Typography>
                    <Chip label={o.status} size="small" color="primary" sx={{ fontWeight: 700 }} />
                  </Paper>
                ))
              )}

              {selectedUser.currentLocation && (
                  <Box sx={{ mt: 4, p: 2, bgcolor: "#f1f5f9", borderRadius: "12px" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>LAST KNOWN LOCATION</Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
                          Lat: {selectedUser.currentLocation.lat} <br/>
                          Lng: {selectedUser.currentLocation.lng}
                      </Typography>
                  </Box>
              )}

                      {/* DELIVERED ORDERS HISTORY */}
<Typography
  variant="subtitle2"
  sx={{
    color: "#64748b",
    mt: 4,
    mb: 2,
    fontWeight: 700,
    textTransform: "uppercase"
  }}
>
  Delivered Orders History
</Typography>

{orders
  .filter(
    (o) =>
      o.deliveryPartnerId === selectedUser!.id&&
      o.status === "Delivered" &&
      o.routeHistory?.length
  )
  .length === 0 ? (
  <Paper
    sx={{
      p: 3,
      textAlign: "center",
      bgcolor: "#f8fafc",
      borderRadius: "12px",
      border: "1px dashed #cbd5e1"
    }}
  >
    <Typography color="textSecondary">
      No delivered orders with route data
    </Typography>
  </Paper>
) : (
  orders
    .filter(
      (o) =>
        o.deliveryPartnerId === selectedUser.id &&
        o.status === "Delivered" &&
        o.routeHistory?.length
    )
    .map((o) => (
      <Paper
        key={o.id}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          bgcolor: "#fff"
        }}
      >
        <Typography fontWeight={700}>
          📦 {o.foodname}
        </Typography>
          <Typography fontWeight={700}>
          📦Order-ID {o.id}
        </Typography>

        <Stack direction="row" spacing={1} mt={1}>
          <Chip
            label="View Route"
            color="primary"
            onClick={() => {
              setSelectedRoute(
                o.routeHistory!.map((p) => [p.lat, p.lng])
              );
              setRouteDialogOpen(true);
            }}
          />

          <Chip
            label="Download KML"
            color="success"
            onClick={() => downloadKML(o.routeHistory!)}
          />
        </Stack>
      </Paper>
    ))
)}
            </>
          )}
        </Box>


      </Drawer>

      <Dialog
  open={routeDialogOpen}
  onClose={() => setRouteDialogOpen(false)}
  maxWidth="md"
  fullWidth
>
  <Box sx={{ height: 500 }}>
    {selectedRoute.length > 0 && (
      <MapContainer
        center={selectedRoute[0]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={selectedRoute} />
      </MapContainer>
    )}
  </Box>
</Dialog>

      {/* STATISTICS DRAWER */}
      <Drawer anchor="right" open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)}>
        <Box sx={{ width: { xs: '100vw', sm: 380 }, p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" fontWeight={800}>Today's Metrics</Typography>
            <IconButton onClick={() => setOrderDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          
          <Stack spacing={2.5}>
            <StatRow label="Total Volume" value={todayOrders.length} color="#0f172a" isBold />
            <Divider />
            <StatRow label="Preparing" value={preparingCount} color="#9333ea" />
            <StatRow label="Out for Delivery" value={outForDeliveryCount} color="#2563eb" />
            <StatRow label="Reached Destination" value={reachedCount} color="#0891b2" />
            <StatRow label="Delivered Successfully" value={deliveredCount} color="#16a34a" />
            <Box sx={{ p: 2, bgcolor: "#fff7ed", borderRadius: "12px", mt: 2 }}>
                <Typography variant="subtitle2" color="#9a3412" fontWeight={700}>TOTAL ACTIVE</Typography>
                <Typography variant="h4" color="#c2410c" fontWeight={900}>{activeCount}</Typography>
            </Box>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
};

// Helper component for cleaner stats
const StatRow = ({ label, value, color, isBold = false }: any) => (
    <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{ color: "#64748b", fontWeight: 600 }}>{label}</Typography>
        <Typography sx={{ color: color, fontWeight: isBold ? 900 : 700, fontSize: isBold ? '1.5rem' : '1.1rem' }}>{value}</Typography>
    </Box>
);

export default DeliveryMonitoring;