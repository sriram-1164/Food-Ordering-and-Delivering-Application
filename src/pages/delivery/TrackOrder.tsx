import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { Box, Typography, Paper } from "@mui/material";
import { CrudService } from "../../services/CrudService";
import { OrderDetails, UserDetails } from "../../services/Model";

const crud = CrudService();

export default function TrackOrder() {
  const { id } = useParams();
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const orders = await crud.getOrders();
      const order = orders.find(
        (o: OrderDetails) => o.id === id
      );

      if (!order?.deliveryPartnerId) return;

      const users = await crud.getUsers();
      const delivery = users.find(
        (u: UserDetails) =>
          u.id === order.deliveryPartnerId
      );

      if (delivery?.currentLocation) {
        setDeliveryLocation(delivery.currentLocation);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e3c72, #2a5298)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "95%",
          maxWidth: 900,
          height: "85vh",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          p={2}
          fontWeight="bold"
        >
          🚚 Live Delivery Tracking
        </Typography>

        {deliveryLocation ? (
          <MapContainer
            center={[
              deliveryLocation.lat,
              deliveryLocation.lng,
            ]}
            zoom={15}
            style={{ height: "90%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[
                deliveryLocation.lat,
                deliveryLocation.lng,
              ]}
            >
              <Popup>
                🚚 Delivery Partner Location
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <Typography textAlign="center" mt={5}>
            Waiting for delivery partner location...
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
