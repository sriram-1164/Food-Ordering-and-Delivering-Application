import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { Box, Typography, Paper, Button } from "@mui/material";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";
import L from "leaflet";
import bikeIconImg from "../../assests/bike.png";
import homeIconImg from "../../assests/home.png";

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


const crud = CrudService();
const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJmY2I5NmIyZjYyZDRmNGFhZGY3NDgzOGMyNzQxMjU5IiwiaCI6Im11cm11cjY0In0=";// 🔥 Add your key

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


  // 🔥 Fetch order & locations
  useEffect(() => {
    const interval = setInterval(async () => {
      const orders = await crud.getOrders();
      const order = orders.find((o: OrderDetails) => o.id === id);
      if (!order) return;

      // Delivery Location
      const users = await crud.getUsers();
      const delivery = users.find(
        (u: UserDetails) => u.id === order.deliveryPartnerId
      );
      if (delivery?.currentLocation) {
        setDeliveryLocation(delivery.currentLocation);
      }

      // Customer Location (for demo we use address saved lat/lng later)
      if (!customerLocation && order.address?.lat) {
        setCustomerLocation({
          lat: order.address.lat,
          lng: order.address.lng,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  // 🔥 Calculate Route + ETA
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

    const steps = 30;
    const latStep =
      (deliveryLocation.lat - animatedPosition.lat) / steps;
    const lngStep =
      (deliveryLocation.lng - animatedPosition.lng) / steps;

    let current = 0;

    const interval = setInterval(() => {
      current++;

      setAnimatedPosition((prev: any) => ({
        lat: prev.lat + latStep,
        lng: prev.lng + lngStep,
      }));

      if (current >= steps) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [deliveryLocation]);



  const openGoogleMaps = () => {
    if (!deliveryLocation || !customerLocation) return;

    const origin = `${deliveryLocation.lat},${deliveryLocation.lng}`;
    const destination = `${customerLocation.lat},${customerLocation.lng}`;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    window.open(url, "_blank");
  };
  ;

  const isUser = loggedUser.role === "user";
  const isDelivery = loggedUser.role === "delivery";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <BackButton
          to={isUser ? "/userorders" : "/delivery/orders"}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "95%",
            maxWidth: 1000,
            height: "85vh",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={2}
          >
            <Typography fontWeight="bold">
              {isUser
                ? `🚚 Your Order is on the way | ETA: ${eta}`
                : `📦 Navigate to Customer | ETA: ${eta}`}
            </Typography>

            <Button
              variant="contained"
              onClick={openGoogleMaps}
              sx={{
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #ff9800, #ff5722)",
              }}
            >
              View on Google Maps
            </Button>
          </Box>

          {deliveryLocation && customerLocation && (
            <MapContainer
              center={[
                deliveryLocation.lat,
                deliveryLocation.lng,
              ]}
              zoom={14}
              style={{ height: "90%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {animatedPosition && (
                <Marker
                  position={[
                    animatedPosition.lat,
                    animatedPosition.lng,
                  ]}    icon={deliveryIcon}
                >
                  <Popup>🚚 Delivery</Popup>
                </Marker>
              )}


              <Marker
                position={[
                  customerLocation.lat,
                  customerLocation.lng,
                ]}  icon={homeIcon}
              >
                <Popup>🏠 Customer</Popup>
              </Marker>

              <Polyline
                positions={route}
                pathOptions={{
                  color: "#0e27c6cc",
                  weight: 5,
                }}
              />

            </MapContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
