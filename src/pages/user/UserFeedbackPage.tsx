// import { useEffect, useState } from "react";
// import {
//     Table,
//     TableHead,
//     TableRow,
//     TableCell,
//     TableBody,
//     Button,
//     Paper,

//     Box,
//     Typography,
// } from "@mui/material";
// import FeedbackDialog from "../../pages/user/FeedbackDialog";
// import { CrudService } from "../../services/CrudService";
// import BackButton from "../../components/common/BackButton";
// import React from "react";

// interface Order {
//     id: string;
//     userId: string;
//     username: string;
//     foodname: string;
//     status: string;
// }

// export default function UserFeedbackPage() {
//     const [orders, setOrders] = useState<any[]>([]);
//     const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//     const [open, setOpen] = useState(false);
//     const userStr = localStorage.getItem("user");
//     const loggedUser = userStr ? JSON.parse(userStr) : null;
//     const crud = CrudService();

// useEffect(() => {
//   crud.getOrders().then((res: any[]) => {
//     console.log("ORDERS RESPONSE:", res);
//     const allOrders = res || [];
//     const userOrders = allOrders.filter(
//       (o: any) =>
//         String(o.userId) === String(loggedUser?.userId) &&
//         o.status?.trim().toLowerCase() === "delivered"
//     );
//     console.log("DELIVERED USER ORDERS:", userOrders);
//     setOrders(userOrders);
//   });
// }, []);

//     const openFeedback = (order: Order) => {
//         setSelectedOrder(order);
//         setOpen(true);
//     };

//     return (
//          <Box
//       p={3}
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
//       }}
//     >
//       <Box mb={2}>
//         <BackButton to="/usermenu" />
//       </Box>

//       <Typography
//         variant="h4"
//         fontWeight="bold"
//         align="center"
//         mb={3}
//         sx={{
//           background: "linear-gradient(135deg, #ff5722, #ff9800)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         Give Your Feedback
//       </Typography>

//       <Paper
//         sx={{
//           p: 3,
//           maxWidth: 900,
//           mx: "auto",
//           borderRadius: 3,
//           boxShadow: 3,
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#ff9800" }}>
//               <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                 Food
//               </TableCell>
//               <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                 Status
//               </TableCell>
//               <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
//                 Action
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {orders.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={3} align="center">
//                   <Typography color="text.secondary">
//                     🍽 No delivered orders available for feedback
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               orders.map((order) => (
//                 <TableRow key={order.id} hover>
//                   <TableCell>{order.foodname}</TableCell>
//                   <TableCell>
//                     <Typography color="success.main" fontWeight="bold">
//                       {order.status}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       sx={{
//                         borderRadius: 2,
//                         background:
//                           "linear-gradient(135deg, #ff5722, #ff9800)",
//                         ":hover": {
//                           background:
//                             "linear-gradient(135deg, #e64a19, #fb8c00)",
//                         },
//                       }}
//                       onClick={() => openFeedback(order)}
//                     >
//                       Give Feedback
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </Paper>

//       <FeedbackDialog
//         open={open}
//         onClose={() => setOpen(false)}
//         order={selectedOrder}
//       />
//     </Box>
//   );

// }
