import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Chip,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { OrderDetails, UserDetails } from "../../services/Model";
import { useNavigate } from "react-router-dom";

interface OrdersTableProps {
  orders: OrderDetails[];
  admin?: boolean;
  onStatusChange?: (order: OrderDetails) => void;   // admin
  onCancelOrder?: (order: OrderDetails) => void;    // user
  onGiveFeedback?: (order: OrderDetails) => void;

  // 🔥 NEW PROPS
  deliveryUsers?: UserDetails[];
  onAssignDelivery?: (orderId: string, deliveryId: number) => void
}


export default function OrdersTable({
  orders,
  admin = false,
  onStatusChange,
  onCancelOrder,
  onGiveFeedback,
  deliveryUsers,
  onAssignDelivery,
}: OrdersTableProps) {
  const navigate = useNavigate();

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background: "linear-gradient(135deg, #ff5722, #ff9800)",
            }}
          >
            {[
              "User",
              "Food",
              "Qty",
              "Total",
              "Date : Time",
              "Address",
              "Mobile",
              "Status",
            ].map((h) => (
              <TableCell key={h} sx={{ color: "#fff", fontWeight: "bold" }}>
                {h}
              </TableCell>
            ))}

            {(admin || onCancelOrder) && (
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Action
              </TableCell>
            )}
            {!admin && (
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Feedback
              </TableCell>
            )}
            {admin && (
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Food-ID
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((o) => (
              <TableRow
                key={o.id}
                sx={{
                  "&:hover": { backgroundColor: "#fff3e0" },
                }}
              >
                <TableCell>{o.username}</TableCell>
                <TableCell>{o.foodname}</TableCell>
                <TableCell>{o.quantity}</TableCell>
                <TableCell>
                  <Typography fontWeight="bold" color="success.main">
                    ₹{o.price * o.quantity}
                  </Typography>
                </TableCell>
                <TableCell>{o.date}</TableCell>
                <TableCell>
                  <Typography fontSize={13}>
                    <strong>{o.address.label}</strong><br />
                    {o.address.addressLine}<br />
                    {o.address.city} - {o.address.pincode}
                  </Typography>
                </TableCell>
                <TableCell>{o.phonenumber}</TableCell>
                <TableCell>
                  <Chip
                    label={o.status}
                    size="small"
                    color={
                      o.status === "Delivered"
                        ? "success"
                        : o.status === "Preparing"
                          ? "warning"
                          : o.status === "Cancelled"
                            ? "error"
                            : "default"
                    }
                  />
                </TableCell>
                {/* ================= ACTION COLUMN ================= */}
                {(admin || onCancelOrder) && (
                  <TableCell>
                    <Box display="flex" gap={1} alignItems="center">
                      {/* ===== ADMIN UPDATE BUTTON ===== */}
                      {admin && (
                        <Button
                          size="small"
                          variant="contained"
                          disabled={
                            o.status === "Cancelled" ||
                            o.status === "Delivered" ||
                            o.status === "OutforDelivery"
                          }
                          sx={{
                            px: 2,
                            borderRadius: 2,
                            background:
                              "linear-gradient(135deg, #ff5722, #ff9800)",
                            ":hover": {
                              background:
                                "linear-gradient(135deg, #e64a19, #fb8c00)",
                            },
                          }}
                          onClick={() => onStatusChange?.(o)}
                        >
                          Update
                        </Button>
                      )}

                      {/* ===== DELIVERY ASSIGN DROPDOWN (ADMIN ONLY) ===== */}
                      {admin && deliveryUsers && onAssignDelivery && (
                        <select
                          value={o.deliveryPartnerId || ""}
                          onChange={(e) =>
                            onAssignDelivery(
                              o.id,
                              Number(e.target.value)
                            )
                          }
                          style={{
                            padding: "4px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                          }}
                        >
                          <option value="">Assign Delivery</option>
                          {deliveryUsers.map((delivery) => (
                            <option
                              key={delivery.id}
                              value={delivery.id}
                            >
                              {delivery.username}
                            </option>
                          ))}
                        </select>
                      )}
                      {!admin &&
                        o.status === "Preparing" &&
                        !o.deliveryPartnerId &&
                        onCancelOrder && (
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ borderRadius: 3 }}
                            onClick={() => onCancelOrder(o)}
                          >
                            Cancel
                          </Button>
                        )}

                      {!admin && o.status === "Delivered" && (
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color="error"
                          align="center"
                        >
                          ---
                        </Typography>
                      )}

                    </Box>
                  </TableCell>
                )}
                {!admin && (
                  <TableCell>
                    {o.status === "Delivered" ? (
                      o.feedbackGiven ? (
                        <Chip label="Submitted" color="success" size="small" />
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => onGiveFeedback?.(o)}
                        >
                          Give Feedback
                        </Button>
                      )
                    ) : o.status === "OutforDelivery" ? (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/track/${o.id}`)}
                      >
                        Track Order
                      </Button>
                    ) : (
                      <Chip label="Hold On" size="small" />
                    )}
                  </TableCell>
                )}

                {admin && (
                  <TableCell>{o.foodId}</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
