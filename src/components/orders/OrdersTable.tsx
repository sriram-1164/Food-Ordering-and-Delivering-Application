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
import { OrderDetails } from "../../services/Model";

interface OrdersTableProps {
  orders: OrderDetails[];
  admin?: boolean;
  onStatusChange?: (order: OrderDetails) => void;   // admin
  onCancelOrder?: (order: OrderDetails) => void;    // user
  onGiveFeedback?: (order: OrderDetails) => void;
}

export default function OrdersTable({
  orders,
  admin = false,
  onStatusChange,
  onCancelOrder,
  onGiveFeedback,
}: OrdersTableProps) {

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
                {(admin || onCancelOrder) && (
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {admin  && (
                        <Button
                          size="small"
                          variant="contained"
                          disabled={o.status === "Cancelled" || o.status === "Delivered"}
                          sx={{
                            px: 3,
                            borderRadius: 3,
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

                      {!admin &&
                        o.status === "Preparing" &&
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
                    ) : (
                      <Chip label="Hold On" size="small" />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
