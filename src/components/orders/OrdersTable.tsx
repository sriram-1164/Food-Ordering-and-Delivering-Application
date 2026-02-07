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
        {/* TABLE HEADER */}
        <TableHead>
          <TableRow
            sx={{
              background: "linear-gradient(135deg, #ff5722, #ff9800)",
            }}
          >
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              User
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Food
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Qty
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Total
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Date : Time
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Address
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Mobile
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Status
            </TableCell>

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

        {/* TABLE BODY */}
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
                <TableCell>{o.address}</TableCell>
                <TableCell>{o.phonenumber}</TableCell>

                {/* STATUS CHIP */}
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

                {/* ACTIONS */}
                {(admin || onCancelOrder) && (
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {/* ADMIN ACTION */}
                      {admin && o.status !== "Cancelled" && (
                        <Button
                          size="small"
                          variant="contained"
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

                      {/* USER CANCEL ACTION */}
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
                      {/* CANCELLED TEXT */}
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
