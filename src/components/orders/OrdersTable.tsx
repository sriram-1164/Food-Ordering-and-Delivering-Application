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
  Avatar,
  Tooltip,
} from "@mui/material";
import { OrderDetails, UserDetails } from "../../services/Model";
import { useNavigate } from "react-router-dom";

// Icons for a professional touch
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface OrdersTableProps {
  orders: OrderDetails[];
  admin?: boolean;
  onStatusChange?: (order: OrderDetails) => void;
  onCancelOrder?: (order: OrderDetails) => void;
  onGiveFeedback?: (order: OrderDetails) => void;
  deliveryUsers?: UserDetails[];
  onAssignDelivery?: (orderId: string, deliveryId: number) => void;
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

  // Modern Status Color Mapping
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered": return { color: "#2e7d32", bg: "#e8f5e9" };
      case "Preparing": return { color: "#ed6c02", bg: "#fff3e0" };
      case "OutforDelivery": return { color: "#0288d1", bg: "#e1f5fe" };
      case "Cancelled": return { color: "#d32f2f", bg: "#ffebee" };
      case "Reached": return { color: "#9c27b0", bg: "#f3e5f5" };
      default: return { color: "#757575", bg: "#f5f5f5" };
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #f0f0f0",
        overflow: "hidden"
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#fafafa" }}>
            {[
              "Order Details",
              "Customer",
              "Quantity",
              "Amount",
              "Logistics",
              "Status",
              (admin || onCancelOrder) ? "Actions" : null,
              !admin ? "Review" : null,
              admin ? "ID Tracker" : null
            ].filter(Boolean).map((h) => (
              <TableCell key={h as string} sx={{ fontWeight: 800, color: "#475467", py: 2.5 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 10 }}>
                <Typography color="textSecondary" fontWeight={500}>
                  No orders found in this category.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((o) => {
              const status = getStatusStyle(o.status);
              return (
                <TableRow key={o.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* ORDER & FOOD */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ bgcolor: '#fff7ed', color: '#ff5722', width: 40, height: 40, border: '1px solid #ffe0b2' }}>
                        <FastfoodIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#1a1a1a">{o.foodname}</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 12 }} /> {o.date}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* USER INFO */}
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{o.username}</Typography>
                    <Typography variant="caption" color="textSecondary">{o.phonenumber}</Typography>
                  </TableCell>

                  {/* QTY */}
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={700}>x{o.quantity}</Typography>
                  </TableCell>

                  {/* TOTAL */}
                  <TableCell>
                    <Typography variant="body2" fontWeight={800} sx={{ color: '#1a1a1a' }}>
                      ₹{o.price * o.quantity}
                    </Typography>
                  </TableCell>

                  {/* ADDRESS & MOBILE */}
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Box display="flex" alignItems="flex-start" gap={0.5} mb={0.5}>
                      <LocationOnIcon sx={{ fontSize: 14, color: '#98a2b3', mt: 0.3 }} />
                      <Typography variant="caption" color="#475467" sx={{ lineHeight: 1.2 }}>
                        <strong>{o.address.label}:</strong> {o.address.addressLine}, {o.address.city}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <Chip 
                      label={o.status} 
                      size="small" 
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: '0.7rem',
                        color: status.color, 
                        bgcolor: status.bg,
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }} 
                    />
                  </TableCell>

                  {/* ACTIONS (ADMIN OR CANCEL) */}
                  {(admin || onCancelOrder) && (
                    <TableCell>
                      <Box display="flex" gap={1} alignItems="center">
                        {admin ? (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={["Cancelled", "Delivered", "Reached", "OutforDelivery"].includes(o.status)}
                              sx={{ 
                                textTransform: 'none', 
                                borderRadius: '8px',
                                boxShadow: 'none',
                                fontWeight: 700,
                                bgcolor: '#FF5200',
                                '&:hover': { bgcolor: '#e64a19', boxShadow: 'none' }
                              }}
                              onClick={() => onStatusChange?.(o)}
                            >
                              Update
                            </Button>

                            {deliveryUsers && (
                              <select
                                value={o.deliveryPartnerId || ""}
                                onChange={(e) => onAssignDelivery?.(o.id, Number(e.target.value))}
                                style={{
                                  padding: "6px",
                                  borderRadius: "8px",
                                  border: "1px solid #d0d5dd",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  outline: 'none'
                                }}
                              >
                                <option value="">Assign Partner</option>
                                {deliveryUsers.map((d) => (
                                  <option key={d.id} value={d.id}>{d.username}</option>
                                ))}
                              </select>
                            )}
                          </>
                        ) : (
                          // USER CANCEL LOGIC
                          o.status === "Preparing" && !o.deliveryPartnerId && (
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none' }}
                              onClick={() => onCancelOrder?.(o)}
                            >
                              Cancel Order
                            </Button>
                          )
                        )}
                      </Box>
                    </TableCell>
                  )}

                  {/* FEEDBACK / TRACKING (USER ONLY) */}
                  {!admin && (
                    <TableCell>
                      {o.status === "Delivered" ? (
                        o.feedbackGiven ? (
                          <Chip label="Review Left" color="success" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                        ) : (
                          <Button 
                            variant="contained" 
                            size="small" 
                            sx={{ bgcolor: '#1a1a1a', borderRadius: '8px', textTransform: 'none' }}
                            onClick={() => onGiveFeedback?.(o)}
                          >
                            Rate Food
                          </Button>
                        )
                      ) : o.status === "OutforDelivery" ? (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          sx={{ borderColor: '#FF5200', color: '#FF5200', borderRadius: '8px' }}
                          onClick={() => navigate(`/delivery/track/${o.id}`)}
                        >
                          Track Live
                        </Button>
                      ) : o.status === "Reached" ? (
                        <Box sx={{ bgcolor: '#fef3f2', p: 1, borderRadius: '8px', border: '1px dashed #fecdca', textAlign: 'center' }}>
                          <Typography variant="caption" fontWeight={900} color="#b42318" display="block">
                            OTP: {o.deliveryOtp}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="textSecondary" fontStyle="italic">Awaiting prep...</Typography>
                      )}
                    </TableCell>
                  )}

                  {/* TRACKERS (ADMIN ONLY) */}
                  {admin && (
                    <TableCell>
                      <Box>
                        <Typography variant="caption" display="block" color="textSecondary">Food: <strong>#{o.foodId}</strong></Typography>
                        <Typography variant="caption" display="block" color="textSecondary">Fleet: <strong>{o.deliveryPartnerId || 'Not Assigned'}</strong></Typography>
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}