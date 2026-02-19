import { Outlet } from "react-router-dom";
import { useLiveLocation } from "./hooks/useLiveLocation";
import { UserDetails } from "../../services/Model";

const DeliveryLayout = () => {
  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isOnline = loggedUser?.isOnline ?? false;

  // 🔥 Tracking moved here (GLOBAL for delivery)
  useLiveLocation(loggedUser, isOnline);

  return <Outlet />;
};

export default DeliveryLayout;
