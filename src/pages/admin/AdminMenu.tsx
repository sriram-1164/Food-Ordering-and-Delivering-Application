import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddFood from "../../components/food/AddFood";
import FoodTable from "../../components/food/FoodTable";
import Loader from "../../components/common/Loader";
import { CrudService } from "../../services/CrudService";

export default function AdminMenu() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [foods, setFoods] = useState<any[]>([]);
  const [editFood, setEditFood] = useState<any>();
  const [loading, setLoading] = useState(true);

  //  confirm delete dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  //  snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") navigate("/");
    loadFoods();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const loadFoods = async () => {
    try {
      setLoading(true);
      const res = await crud.getFoods();
      setFoods(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load foods", err);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    await crud.deleteFood(deleteId);
    setConfirmOpen(false);
    setDeleteId(null);

    loadFoods();
    setSnackbarMsg("Food item deleted successfully");
    setSnackbarOpen(true);
  };

  if (loading) return <Loader />;

  return (
  <Box
    sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
      px: { xs: 2, md: 4 },
      py: 3,
    }}
  >
    {/* HEADER SECTION */}
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      mb={4}
      sx={{ background: 'rgba(255,255,255,0.4)', p: 2, borderRadius: 4, backdropFilter: 'blur(10px)' }}
    >
      <Typography 
        variant="h4" 
        fontWeight="900"
        sx={{
          background: "linear-gradient(135deg, #601600, #f67c0a)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Admin Dashboard
      </Typography>
      
      <Button 
        color="error" 
        variant="contained" 
        onClick={() => setLogoutOpen(true)}
        sx={{ borderRadius: 2, px: 4, fontWeight: 'bold', textTransform: 'none' }}
      >
        Logout
      </Button>
    </Box>

    {/* MAIN GRID LAYOUT */}
    <Grid container spacing={3}>
      {/* COLUMN 1: ADD FOOD FORM */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Box
          sx={{
            backgroundColor: "#f67c0a",
            borderRadius: 5,
            p: 3,
            boxShadow: "0 10px 30px rgba(246, 124, 10, 0.3)",
            position: { md: "sticky" },
            top: 24,
          }}
        >
          <AddFood
            editFood={editFood}
            onSave={() => {
              setEditFood(null);
              loadFoods();
              setSnackbarMsg(editFood ? "Food updated successfully!" : "Food added successfully!");
              setSnackbarOpen(true);
            }}
          />
        </Box>
      </Grid>

      {/* COLUMN 2: FOOD TABLE */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 5,
            p: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight="800" mb={2} color="#475569" px={1}>
            Menu Inventory
          </Typography>
          <FoodTable
            foods={foods}
            admin
            onEdit={(food: any) => setEditFood(food)}
            onDelete={(id: string) => {
              setDeleteId(id);
              setConfirmOpen(true);
            }}
          />
        </Box>

        {/* VIEW ORDERS BUTTON */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/adminorders")}
            sx={{
              px: 6,
              py: 2,
              borderRadius: 4,
              fontWeight: "900",
              fontSize: '1rem',
              background: "linear-gradient(135deg, #ff5722, #ff9800)",
              boxShadow: "0 8px 20px rgba(255, 87, 34, 0.3)",
              textTransform: 'none',
              "&:hover": {
                background: "linear-gradient(135deg, #e64a19, #fb8c00)",
                transform: 'translateY(-2px)',
              },
              transition: '0.3s'
            }}
          >
            View Customer Orders
          </Button>
        </Box>
      </Grid>
    </Grid>

    {/* --- REDESIGNED DIALOGS --- */}

    {/* DELETE CONFIRMATION */}
    <Dialog 
      open={confirmOpen} 
      onClose={() => setConfirmOpen(false)}
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', color: '#ef4444' }}>Delete Item?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          Are you sure you want to remove this item from the menu? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#64748b', fontWeight: 'bold' }}>Cancel</Button>
        <Button
          onClick={handleDeleteConfirm}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
        >
          Delete Now
        </Button>
      </DialogActions>
    </Dialog>

    {/* LOGOUT CONFIRMATION */}
    <Dialog 
      open={logoutOpen} 
      onClose={() => setLogoutOpen(false)}
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Logout</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          Ready to leave? We'll see you back in the kitchen soon!
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setLogoutOpen(false)} sx={{ color: '#64748b', fontWeight: 'bold' }}>Stay Here</Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity="success" variant="filled" onClose={() => setSnackbarOpen(false)} sx={{ borderRadius: 3 }}>
        {snackbarMsg}
      </Alert>
    </Snackbar>
  </Box>
)}