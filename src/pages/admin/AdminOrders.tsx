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
  Paper,
  Stack,
  Divider,
  Container,
  Grid, // Ensure you use the standard MUI Grid
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrudService } from "../../services/CrudService";
import OrdersTable from "../../components/orders/OrdersTable";
import StatusDialog from "../../components/orders/StatusDialog";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import { OrderDetails } from "../../services/Model";

import FeedbackIcon from '@mui/icons-material/RateReview';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function AdminOrders() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8; // Increased for better desktop view
  const [selected, setSelected] = useState<OrderDetails | null>(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState({
    Preparing: true,
    Delivered: true,
    Cancelled: true,
    OutforDelivery: true,
    Reached: true
  });

  const loadOrders = () => {
    setLoading(true);
    crud.getOrders().then((res: any[]) => {
      setOrders(Array.isArray(res) ? res : []);
      setLoading(false);
    });
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatus = async (id: string, status: any) => {
    // ... (Your existing handleStatus logic)
    setOpen(false);
    setSelected(null);
    setSnackbarOpen(true);
    loadOrders();
  };

  if (loading) return <Loader />;

  const filteredOrders = orders
    .filter((o) => (statusFilter as any)[o.status])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const paginatedOrders = filteredOrders.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f7f9", pb: 8 }}>
      {/* HEADER SECTION */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: "#fff", 
          borderBottom: "1px solid #eef2f6", 
          py: 3, 
          mb: 4, 
          borderRadius: 0 
        }}
      >
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <BackButton to="/adminmenu" />
              <Box>
                <Typography variant="h4" fontWeight={850} letterSpacing={-1} color="#1e293b">
                  Orders
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage customer requests and fleet dispatch
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <NavButton icon={<FeedbackIcon />} label="Feedbacks" onClick={() => navigate("/adminfeedback")} />
              <NavButton icon={<AssessmentIcon />} label="Reports" onClick={() => navigate("/admin/reports")} />
              <NavButton icon={<PersonAddIcon />} label="Add Fleet" onClick={() => navigate("/adminadddelivery")} />
              <NavButton 
                icon={<LocalShippingIcon />} 
                label="Fleet Live" 
                onClick={() => navigate("/deliverydashboard")} 
                active 
              />
            </Stack>
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* LEFT COLUMN: FILTERS */}
          <Grid size={{xs:12 , lg:2.5}}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #eef2f6' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
                  <FilterListIcon sx={{ color: '#FF5200' }} />
                  <Typography variant="subtitle1" fontWeight={800}>Status Filter</Typography>
                </Stack>
                
                <FormGroup>
                  {Object.keys(statusFilter).map((status) => (
                    <FormControlLabel
                      key={status}
                      control={
                        <Checkbox
                          size="small"
                          checked={(statusFilter as any)[status]}
                          onChange={(e) => setStatusFilter({ ...statusFilter, [status]: e.target.checked })}
                          sx={{ 
                            color: '#cbd5e1', 
                            '&.Mui-checked': { color: '#FF5200' } 
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={600} color="#475569">
                          {status}
                        </Typography>
                      }
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </FormGroup>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ p: 2, bgcolor: '#fff7ed', borderRadius: 3, border: '1px solid #ffedd5' }}>
                  <Typography variant="caption" fontWeight={700} color="#9a3412" sx={{ display: 'block', mb: 0.5 }}>
                    QUICK STATS
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#ea580c">
                    {filteredOrders.length}
                  </Typography>
                  <Typography variant="caption" color="#c2410c">Active results</Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN: TABLE */}
          <Grid size={{xs:12 ,lg:9.5}}>
            <Paper 
              sx={{ 
                borderRadius: 5, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
                overflow: 'hidden',
                border: '1px solid #eef2f6'
              }}
            >
              <Box sx={{ p: 3, bgcolor: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={800} color="#1e293b">
                  Order Queue
                </Typography>
                <Typography variant="caption" sx={{ bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 700 }}>
                  Page {page} of {Math.ceil(filteredOrders.length / rowsPerPage)}
                </Typography>
              </Box>

              <OrdersTable
                orders={paginatedOrders}
                admin
                onStatusChange={(order) => { setSelected(order); setOpen(true); }}
              />

              <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', bgcolor: '#fff' }}>
                <Pagination
                  count={Math.ceil(filteredOrders.length / rowsPerPage)}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': { fontWeight: 700 },
                    '& .Mui-selected': { bgcolor: '#FF5200 !important', color: '#fff' }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <StatusDialog open={open} onClose={() => setOpen(false)} onSubmit={(status : any) => handleStatus(selected!.id, status)} />
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
          Order Database Updated
        </Alert>
      </Snackbar>
    </Box>
  );
}

const NavButton = ({ icon, label, onClick, active = false }: any) => (
  <Button
    variant={active ? "contained" : "text"}
    startIcon={icon}
    onClick={onClick}
    sx={{
      px: 2.5,
      py: 1,
      borderRadius: "12px",
      textTransform: "none",
      fontWeight: 800,
      boxShadow: active ? '0 4px 12px rgba(255, 82, 0, 0.2)' : 'none',
      bgcolor: active ? '#FF5200' : 'transparent',
      color: active ? '#fff' : '#64748b',
      '&:hover': {
        bgcolor: active ? '#e64a19' : '#f1f5f9',
        boxShadow: active ? '0 6px 15px rgba(255, 82, 0, 0.3)' : 'none',
      }
    }}
  >
    {label}
  </Button>
);