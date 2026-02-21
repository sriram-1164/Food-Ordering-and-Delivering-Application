import { useEffect, useRef } from "react";
import { CrudService } from "../../../services/CrudService";

const crud = CrudService();

export const useLiveLocation = (user: any, isOnline: boolean, orderId?: string) => {
  const lastLocation = useRef<any>(null);

  useEffect(() => {
    if (!user?.id || !isOnline) {
      console.log("❌ Live tracking NOT started", user?.id, isOnline);
      return;
    }
    console.log("TRACKING STATUS:", isOnline);
    console.log("📍 Live tracking started");

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // First time update
        if (!lastLocation.current) {
          lastLocation.current = { lat, lng };

          await crud.updateUser(user.id, {
            currentLocation: { lat, lng },
          });

          return;
        }


        console.log("📡 GPS Fired:", lat, lng);

        // Calculate distance
        const distance = getDistance(
          lastLocation.current.lat,
          lastLocation.current.lng,
          lat,
          lng
        );

        // Only update if moved > 10 meters
        if (distance > 0.1) {
          lastLocation.current = { lat, lng };

          await crud.updateUser(user.id, {
            currentLocation: { lat, lng },
          });
          // 🔹 2️⃣ Update order (for route history)
          if (orderId) {
            await crud.updateOrder(orderId, {
              newRoutePoint: {
                lat,
                lng,
                timestamp: Date.now()
              }
            });
          }
          console.log("ORDER ID RECEIVED:", orderId);


          console.log("✅ Location Updated:", lat, lng);
          console.log("Distance (m):", (distance * 1000).toFixed(2));

        }
      },
      (error) => console.log("Location Error:", error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      console.log("🛑 Live tracking stopped");
    };
  }, [user?.id, isOnline, orderId]);
};


// Distance calculator (KM)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
