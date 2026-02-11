import {
  Box,
  Typography,
  Pagination,
  Snackbar,
  Alert,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../services/CrudService";
import OrdersTable from "../../components/orders/OrdersTable";
import StatusDialog from "../../components/orders/StatusDialog";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import { useNavigate } from "react-router-dom";
import { OrderDetails } from "../../services/Model";

export default function AdminOrders() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [selected, setSelected] = useState<OrderDetails | null>(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  //  STATUS FILTER STATE
  const [statusFilter, setStatusFilter] = useState({
    Preparing: true,
    Delivered: true,
    Cancelled: true,
  });

  // LOAD ORDERS
  const loadOrders = () => {
    setLoading(true);
    crud.getOrders().then((res: any[]) => {
      setOrders(Array.isArray(res) ? res : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // UPDATE ORDER STATUS
  const handleStatus = async (
    id: string,
    status: "Preparing" | "Delivered"
  ) => {
    await crud.updateOrder(id, { status });
    setOpen(false);
    setSelected(null);
    setSnackbarOpen(true);
    loadOrders();
  };

  if (loading) return <Loader />;

  //  APPLY STATUS FILTER
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );


  const filteredOrders = sortedOrders.filter(
    (o) => statusFilter[o.status]
  );

  // PAGINATION AFTER FILTER
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <Box
        p={3}
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
        }}
      >
        {/* TOP BAR */}
        <Box mb={2} display="flex" gap={2}>
          <BackButton to="/adminmenu" />
          <Button
            variant="contained"
            onClick={() => navigate("/adminfeedback")}
            sx={{
              px: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #273ab7, #1aa1db)",
            }}
          >
            View Feedback
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/reports")}
              sx={{
              px: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #273ab7, #1aa1db)",
            }}
          >
            View Sales Report
          </Button>

        </Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          mb={3}
          sx={{
            background: "linear-gradient(135deg, #ff5722, #ff9800)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Customer Orders
        </Typography>
        <Box
          mb={2}
          p={2}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography fontWeight="bold" mb={1}>
            Filter by Order Status
          </Typography>

          <FormGroup row>
            {["Preparing", "Delivered", "Cancelled"].map((status) => (
              <FormControlLabel
                key={status}
                control={
                  <Checkbox
                    checked={(statusFilter as any)[status]}
                    onChange={(e) =>
                      setStatusFilter({
                        ...statusFilter,
                        [status]: e.target.checked,
                      })
                    }
                  />
                }
                label={status}
              />
            ))}
          </FormGroup>
        </Box>

        {/* TABLE */}
        <Box
          p={2}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <OrdersTable
            orders={paginatedOrders}
            admin
            onStatusChange={(order: OrderDetails) => {
              setSelected(order);
              setOpen(true);
            }}
          />
        </Box>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredOrders.length / rowsPerPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>
        <StatusDialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={(status: "Preparing" | "Delivered") =>
            handleStatus(selected!.id, status)
          }
        />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          ✅ Order status updated successfully
        </Alert>
      </Snackbar>
    </>
  );
}
