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

  /* ---------------- DELETE FOOD ---------------- */
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
    <><Box

      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems={"center"} alignContent={"center"}>

        <Typography variant="h1" align="center" fontWeight="bold" padding={"2rem"}
          sx={{
            background: "linear-gradient(135deg, #feedd1, #601600)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginLeft: "20rem"
          }}
        >
          Admin DashBoard
        </Typography>
        <Button color="error" variant="contained" onClick={() => setLogoutOpen(true)}>
          Logout
        </Button>
      </Box>





      <Box
        mb={3}
        p={2}

        sx={{
          backgroundColor: "#f67c0a",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <AddFood
          editFood={editFood}
          onSave={() => {
            setEditFood(null);
            loadFoods();

            setSnackbarMsg(
              editFood
                ? "Food updated successfully"
                : "Food added successfully"
            );
            setSnackbarOpen(true);
          } } />
      </Box>


      <Box
        p={2}
        sx={{
          backgroundColor: "#f67c0a",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <FoodTable
          foods={foods}
          admin
          onEdit={(food: any) => setEditFood(food)}
          onDelete={(id: string) => {
            setDeleteId(id);
            setConfirmOpen(true);
          } } />
      </Box>


      <Box display="flex" justifyContent="center" p={4}>
        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #ff5722, #ff9800)",
            ":hover": {
              background: "linear-gradient(135deg, #e64a19, #fb8c00)",
            },
          }}
          onClick={() => navigate("/adminorders")}
        >
          View Customer Orders
        </Button>
      </Box>


      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Food</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this food item?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>


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
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
    <Dialog
      open={logoutOpen}
      onClose={() => setLogoutOpen(false)}
    >
        <DialogTitle>Confirm Logout</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setLogoutOpen(false)}
            color="inherit"
          >
            Cancel
          </Button>

          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog></>

  );
}
