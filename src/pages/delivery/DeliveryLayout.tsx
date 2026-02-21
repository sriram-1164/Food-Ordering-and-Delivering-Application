import { Outlet } from "react-router-dom";
import { useLiveLocation } from "./hooks/useLiveLocation";
import { UserDetails } from "../../services/Model";
import { useEffect, useState } from "react";
import { CrudService } from "../../services/CrudService";
import { OrderDetails } from "../../services/Model";

const DeliveryLayout = () => {
  const loggedUser: UserDetails = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const crud = CrudService();
const [orders, setOrders] = useState<OrderDetails[]>([]);

useEffect(() => {
  const loadOrders = async () => {
    const data = await crud.getOrders();
    setOrders(data);
  };

 

  loadOrders();
  const interval = setInterval(loadOrders, 5000);
  return () => clearInterval(interval);
}, []);
 const activeOrder = orders.find(
  (o) =>
    o.deliveryPartnerId === loggedUser.id &&
    o.status === "OutforDelivery"
); 

const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);

useEffect(() => {
  const loadUser = async () => {
    const users = await crud.getUsers();
    const freshUser = users.find(u => u.id === loggedUser.id);
    setCurrentUser(freshUser || null);
  };

  loadUser();
  const interval = setInterval(loadUser, 5000);
  return () => clearInterval(interval);
}, []);
 

const isOnline = currentUser?.isOnline ?? false;

  // 🔥 Tracking moved here (GLOBAL for delivery)
 useLiveLocation(currentUser, isOnline, activeOrder?.id);

 console.log("ACTIVE ORDER:", activeOrder);
console.log("IS ONLINE:", isOnline);
  return <Outlet />;
};

export default DeliveryLayout;
