import { Box, Typography, Button, DialogActions, Dialog, DialogContent, DialogTitle, Grid, Stack, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import FoodFilters from "../../components/food/FoodFilters";
import FoodTable from "../../components/food/FoodTable";
import OrderDialog from "../../components/orders/OrderDialog";
import { CrudService } from "../../services/CrudService";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import CallIcon from "@mui/icons-material/Call";
import CoPresentIcon from '@mui/icons-material/CoPresent';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

 const supportNumbers = [
  '+919600652526',
  '+919360790976',
  '+918056915752',
  '+918148480938',
  // Add as many as you want
];

export default function UserMenu() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [foods, setFoods] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("Friend");
  const [logoutOpen, setLogoutOpen] = useState(false);

  // calling option logic
 const [openCallDialog, setOpenCallDialog] = useState(false);

  const handleOpenCallDialog = () => setOpenCallDialog(true);
  const handleCloseCallDialog = () => setOpenCallDialog(false);
  const handleCallNow = () => {
    // Pick a random number from the array
    const randomIndex = Math.floor(Math.random() * supportNumbers.length);
    const selectedNumber = supportNumbers[randomIndex];
    window.location.href = `tel:${selectedNumber}`;
    setOpenCallDialog(false);
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsername(user.username);
    }
    const role = localStorage.getItem("role");
    if (role !== "user") navigate("/");
  }, [navigate]);

  useEffect(() => {
    crud.getFoods().then((res) => {
      const normalizedFoods = res.map((f: any) => ({
        ...f,
        name: f.foodname,
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
        pb: 6
      }}
    >
      {/* NAVBAR / TOP ACTION BAR */}
      <Box 
        sx={{ 
          position: 'sticky', top: 0, zIndex: 1000, 
          bgcolor: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(10px)',
          px: { xs: 2, md: 4 }, py: 1.5,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h6" fontWeight="900" sx={{ color: '#f67c0a' }}>
          FOODIE<span style={{ color: '#333' }}>HUB</span>
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button 
            size="small"
            startIcon={<CallIcon />} 
            onClick={handleOpenCallDialog}
            sx={{ color: '#2e7d32', fontWeight: 'bold' }}
          >
            Support
          </Button>
          <Button 
            size="small"
            startIcon={<CoPresentIcon />} 
            onClick={() => navigate("/profile")}
            sx={{ color: '#333', fontWeight: 'bold' }}
          >
            Profile
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={() => setLogoutOpen(true)}
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      {/* HERO SECTION */}
      <Box sx={{ px: { xs: 2, md: 6 }, pt: 4, pb: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h2"
              fontWeight="900"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                lineHeight: 1.1,
                mb: 2,
                background: "linear-gradient(135deg, #601600, #ff5722)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hungry, {username}?
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
              Discover the best food & drinks in your area. ❤️
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<ShoppingBagIcon />}
              onClick={() => navigate("/userorders")}
              sx={{
                px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold',
                background: "linear-gradient(135deg, #ff5722, #ff9800)",
                boxShadow: "0 8px 20px rgba(255, 87, 34, 0.3)",
              }}
            >
              Track My Orders
            </Button>
          </Grid>
          
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
             {/* Decorative Food Illustration Placeholder */}
             <Box 
              component="img"
              src="https://cdn-icons-png.flaticon.com/512/3170/3170733.png"
              sx={{ width: '100%', maxWidth: 350, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}
             />
          </Grid>
        </Grid>
      </Box>

      {/* FILTER & MENU SECTION */}
      <Box sx={{ px: { xs: 2, md: 6 }, mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <FoodFilters foods={foods} onFilter={setFiltered} />
        </Box>

        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 5,
            p: 1,
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
            border: "1px solid rgba(255,255,255,0.8)",
            overflow: "hidden"
          }}
        >
          <FoodTable
            foods={filtered}
            user
            onOrder={(food: any) => {
              setSelectedFood(food);
              setOpen(true);
            }} 
          />
        </Box>
      </Box>

      {/* --- DIALOGS (Redesigned) --- */}

      {/* Logout Dialog */}
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">Are you sure you want to logout from your account?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setLogoutOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained" sx={{ borderRadius: 2 }}>Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Call Dialog */}
   <Dialog
        open={openCallDialog}
        onClose={handleCloseCallDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            minWidth: 320,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Need Help?
        </DialogTitle>

        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Avatar
            sx={{
              bgcolor: '#4caf50',
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
            }}
          >
            <CallIcon fontSize="large" />
          </Avatar>

          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Talk to our support team
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Available 24/7 • One of our team members will be connect
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleCloseCallDialog}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2, px: 4 }}
          >
            Maybe Later
          </Button>

          <Button
            onClick={handleCallNow}
            variant="contained"
            color="success"
            sx={{
              borderRadius: 2,
              px: 5,
              py: 1.2,
              fontWeight: 600,
            }}
          >
            Call Now
          </Button>
        </DialogActions>
      </Dialog>

      <OrderDialog
        open={open}
        food={selectedFood}
        onClose={() => setOpen(false)}
        onSubmit={(data: any) => crud.addOrder(data).then(() => setOpen(false))} 
      />
    </Box>
  );
}