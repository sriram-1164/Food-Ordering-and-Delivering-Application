import { Box, Typography, Button, DialogActions, Dialog, DialogContent, DialogTitle,  } from "@mui/material";
import { useEffect, useState } from "react";
import FoodFilters from "../../components/food/FoodFilters";
import FoodTable from "../../components/food/FoodTable";
import OrderDialog from "../../components/orders/OrderDialog";
import { CrudService } from "../../services/CrudService";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import CallIcon from "@mui/icons-material/Call";
import CoPresentIcon from '@mui/icons-material/CoPresent';


export default function UserMenu() {

  const crud = CrudService();

  const [foods, setFoods] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState("Friend");
  const [logoutOpen, setLogoutOpen] = useState(false);

  // for calling option
  const phoneNumber = "+919600652526";
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const handleOpenCallDialog = () => {
    setOpenCallDialog(true);
  };
  const handleCloseCallDialog = () => {
    setOpenCallDialog(false);
  };
  const handleCallNow = () => {
    window.location.href = `tel:${phoneNumber}`;
  };


  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsername(user.username);
    }
  }, []);


  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "user") navigate("/");
  }, [navigate]);

  useEffect(() => {
    crud.getFoods().then((res) => {

      const normalizedFoods = res.map((f: any) => ({
        ...f,
        name: f.name || f.foodname,
      }));

      setFoods(normalizedFoods);
      setFiltered(normalizedFoods);
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return <Loader />;

  return (
    <><><Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
      }}
    >
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button 
        sx={{
          px: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f04b4b, #95391f)",
          ":hover": {
            background: "linear-gradient(135deg, #e64a19, #fb8c00)",
          },
        }}
         variant="contained" onClick={() => setLogoutOpen(true)}>
          Logout
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button
          variant="contained"
          sx={{
            px: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #6dee31, #3c921f)",
            ":hover": {
              background: "linear-gradient(135deg, #e64a19, #fb8c00)",
            },
          }}
          startIcon={<CallIcon />}
          onClick={handleOpenCallDialog}
        >
          Support
        </Button>
        <Button

          variant="contained"
          sx={{
            px: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #6dee31, #3c921f)",
            ":hover": {
              background: "linear-gradient(135deg, #e64a19, #fb8c00)",
            },
          }}
          startIcon={<CoPresentIcon />}
          onClick={() => navigate("/profile")}>
          Profile
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        textAlign="center"
        flexDirection="column"
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #ff5722, #ff9800)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Place Your Order {username}
          <span
            style={{
              marginLeft: "8px",
              WebkitTextFillColor: "initial",
              color: "red",
            }}
          >
            ❤️
          </span>
        </Typography>
      </Box>

      <FoodFilters foods={foods} onFilter={setFiltered} />

      <Box
        p={2}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <FoodTable
          foods={filtered}
          user
          onOrder={(food: any) => {
            setSelectedFood(food);
            setOpen(true);
          }} />
      </Box>


      <Box display="flex" justifyContent="center" mt={3}>
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
          onClick={() => navigate("/userorders")}
        >
          View My Orders
        </Button>
      </Box>


      <OrderDialog
        open={open}
        food={selectedFood}
        onClose={() => setOpen(false)}
        onSubmit={(data: any) => crud.addOrder(data).then(() => setOpen(false))} />
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

      <Dialog open={openCallDialog} onClose={handleCloseCallDialog}>
        <DialogTitle>Call Support</DialogTitle>

        <DialogContent>
          <Typography>
            If you are facing any issues, do you want to call support now?
          </Typography>
          <Typography mt={1} fontWeight="bold">
            📞  +91 9600652526
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseCallDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleCallNow}
            variant="contained"
            color="success"
          >
            Call Now
          </Button>
        </DialogActions>
      </Dialog></>


  );
}
