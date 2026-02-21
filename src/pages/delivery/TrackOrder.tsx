import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Divider, 
  Stack, 
  IconButton,
  Tooltip 
} from "@mui/material";
import { 
  Navigation as NavigationIcon, 
  Timer as TimerIcon, 
  LocationOn as LocationIcon,
  FiberManualRecord as PulseIcon
} from "@mui/icons-material";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";
import L from "leaflet";
import bikeIconImg from "../../assests/bike.png";
import homeIconImg from "../../assests/home.png";
import "leaflet-rotatedmarker";
import { Marker as LeafletMarker } from "leaflet";

// --- Styles & Animations ---
const pulseAnimation = {
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.4 },
    "100%": { opacity: 1 },
  },
};

// 🚴 Delivery Bike Icon
const deliveryIcon = new L.Icon({
  iconUrl: bikeIconImg,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
});

// 🏠 Home Icon
const homeIcon = new L.Icon({
  iconUrl: homeIconImg,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.cos(dLon);
  const bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

const crud = CrudService();
const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJmY2I5NmIyZjYyZDRmNGFhZGY3NDgzOGMyNzQxMjU5IiwiaCI6Im11cm11cjY0In0=";

export default function TrackOrder() {
  const { id } = useParams();
  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
  const [customerLocation, setCustomerLocation] = useState<any>(null);
  const [route, setRoute] = useState<any[]>([]);
  const [eta, setEta] = useState("");
  const [animatedPosition, setAnimatedPosition] = useState<any>(null);
  const [bearing, setBearing] = useState(0);
  const markerRef = useRef<LeafletMarker | null>(null);

  // 🔥 Logic remains untouched
  useEffect(() => {
    const interval = setInterval(async () => {
      const orders = await crud.getOrders();
      const order = orders.find((o: OrderDetails) => o.id === id);
      if (!order) return;
      const users = await crud.getUsers();
      const delivery = users.find(
        (u: UserDetails) => u.id === order.deliveryPartnerId
      );
      if (delivery?.currentLocation) {
        console.log("📍 DB Delivery Location:", delivery.currentLocation);
        setDeliveryLocation(delivery.currentLocation);
      }
      if (!customerLocation && order.address?.lat) {
        setCustomerLocation({
          lat: order.address.lat,
          lng: order.address.lng,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!deliveryLocation || !customerLocation) return;
      try {
        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            method: "POST",
            headers: {
              Authorization: API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coordinates: [
                [deliveryLocation.lng, deliveryLocation.lat],
                [customerLocation.lng, customerLocation.lat],
              ],
            }),
          }
        );
        if (!response.ok) {
          console.error("Route API error:", response.status);
          return;
        }
        const data = await response.json();
        console.log("Route response:", data);
        if (!data.routes?.length) return;
        const encoded = data.routes[0].geometry;
        const decoded = polyline.decode(encoded);
        setRoute(decoded.map((p: any) => [p[0], p[1]]));
        const duration = data.routes[0].summary.duration;
        setEta(Math.round(duration / 60) + " mins");
      } catch (error) {
        console.error("Routing failed:", error);
      }
    };
    fetchRoute();
  }, [deliveryLocation]);

  useEffect(() => {
    if (!deliveryLocation) return;
    if (!animatedPosition) {
      setAnimatedPosition(deliveryLocation);
      return;
    }
    const newBearing = calculateBearing(
      animatedPosition.lat,
      animatedPosition.lng,
      deliveryLocation.lat,
      deliveryLocation.lng
    );
    console.log("🧭 Heading:", newBearing);
    setBearing(newBearing);
    const steps = 30;
    const latStep = (deliveryLocation.lat - animatedPosition.lat) / steps;
    const lngStep = (deliveryLocation.lng - animatedPosition.lng) / steps;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setAnimatedPosition((prev: any) => {
        const newPos = {
          lat: prev.lat + latStep,
          lng: prev.lng + lngStep,
        };
        const newBearing = calculateBearing(
          prev.lat,
          prev.lng,
          newPos.lat,
          newPos.lng
        );
        if (Math.abs(newBearing - bearing) > 1) {
          setBearing(newBearing);
        }
        console.log("🧭 Heading:", newBearing);
        return newPos;
      });
      if (current >= steps) {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [deliveryLocation, animatedPosition]);

  useEffect(() => {
    if (markerRef.current) {
      (markerRef.current as any).setRotationAngle(bearing);
    }
  }, [bearing]);

  const openGoogleMaps = () => {
    if (!deliveryLocation || !customerLocation) return;
    const origin = `${deliveryLocation.lat},${deliveryLocation.lng}`;
    const destination = `${customerLocation.lat},${customerLocation.lng}`;
    const mode = loggedUser.role === "delivery" ? "bicycling" : "driving";
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
    window.open(url, "_blank");
  };

  const isUser = loggedUser.role === "user";

  function AutoCenter({ position }: { position: any }) {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView([position.lat, position.lng], map.getZoom());
      }
    }, [position]);
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        p: { xs: 1, md: 3 },
        ...pulseAnimation,
      }}
    >
      {/* Header Area */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <BackButton to={isUser ? "/userorders" : "/delivery/orders"} />
        <Typography variant="h5" fontWeight="800" color="white" sx={{ letterSpacing: -0.5 }}>
          Track Order <span style={{ color: "#38bdf8" }}>#{id?.slice(-6)}</span>
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: 1200,
            height: "80vh",
            borderRadius: 6,
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Left Side Info Panel */}
          <Box
            sx={{
              width: { xs: "100%", md: "320px" },
              background: "#ffffff",
              p: 3,
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Chip
                  icon={<PulseIcon sx={{ fontSize: "12px !important", color: "#22c55e !important", animation: "pulse 2s infinite" }} />}
                  label="LIVE TRACKING"
                  size="small"
                  sx={{ fontWeight: "bold", mb: 1, backgroundColor: "#f0fdf4", color: "#166534" }}
                />
                <Typography variant="h6" fontWeight="bold" color="#1e293b">
                  {isUser ? "Coming to you" : "Navigate to Customer"}
                </Typography>
              </Box>

              <Divider />

              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#eff6ff" }}>
                  <TimerIcon sx={{ color: "#3b82f6" }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>ESTIMATED TIME</Typography>
                  <Typography variant="h5" fontWeight="900" color="#1e293b">{eta || "Calculating..."}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#fff7ed" }}>
                  <LocationIcon sx={{ color: "#f97316" }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>DESTINATION</Typography>
                  <Typography variant="body2" fontWeight="600" noWrap sx={{ maxWidth: 180 }}>
                    {customerLocation ? "Customer Residence" : "Locating..."}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ flexGrow: 1 }} />

              <Button
                fullWidth
                variant="contained"
                startIcon={<NavigationIcon />}
                onClick={openGoogleMaps}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  "&:hover": { background: "#1d4ed8" }
                }}
              >
                Google Maps
              </Button>
            </Stack>
          </Box>

          {/* Right Side Map */}
          <Box sx={{ flex: 1, position: "relative", minHeight: "300px" }}>
            {deliveryLocation && customerLocation ? (
              <MapContainer
                center={[deliveryLocation.lat, deliveryLocation.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <AutoCenter position={deliveryLocation} />
                <TileLayer
                  attribution="© OpenStreetMap"
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {animatedPosition && (
                  <Marker
                    ref={markerRef}
                    position={[animatedPosition.lat, animatedPosition.lng]}
                    icon={deliveryIcon}
                  >
                    <Popup>🚚 Delivery Partner</Popup>
                  </Marker>
                )}

                <Marker
                  position={[customerLocation.lat, customerLocation.lng]}
                  icon={homeIcon}
                >
                  <Popup>🏠 Customer</Popup>
                </Marker>

                <Polyline
                  positions={route}
                  pathOptions={{
                    color: "#3b82f6",
                    weight: 6,
                    opacity: 0.7,
                    lineJoin: "round",
                    dashArray: "1, 10" // Creates a modern dotted path effect
                  }}
                />
              </MapContainer>
            ) : (
              <Box sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "white" }}>
                <Typography>Initializing Map Engine...</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}