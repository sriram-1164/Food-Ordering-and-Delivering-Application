import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Divider,
  IconButton,
  Stack,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CrudService } from "../../services/CrudService";

// Icons
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeIcon from '@mui/icons-material/Home';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

export default function OrderDialog({ open, food, onClose, onSubmit }: any) {
  const [quantity, setQuantity] = useState(1);
  const [phonenumber, setPhoneNumber] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const navigate = useNavigate();
  const crud = CrudService();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedUserPhone = user?.phonenumber || "";

  useEffect(() => {
    if (!open || !user?.userId) return;
    const loadAddresses = async () => {
      try {
        const users = await crud.getUsers();
        const currentUser = users.find((u: any) => u.userId === user.userId);
        if (currentUser?.addresses?.length) {
          setAddresses(currentUser.addresses);
          setSelectedAddress(currentUser.addresses[0]);
        } else {
          setAddresses([]);
          setSelectedAddress(null);
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };
    loadAddresses();
  }, [open, user.userId]);
  
  useEffect(() => {
    if (open) {
      setPhoneNumber(loggedUserPhone);
    }
  }, [open]);

  if (!food) return null;

  const isValidPhoneNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const totalPrice = quantity * food.price;

  const handlePrepareOrder = () => {
    const payload = {
      userId: String(user.userId),
      username: user.username,
      foodId: food.foodId,
      foodname: food.foodname,
      price: food.price,
      quantity,
      totalPrice,
      mealtype: food.mealtype,
      foodtype: food.foodtype,
      address: selectedAddress,
      phonenumber,
      status: "Preparing",
      date: new Date().toISOString(),
    };
    setPendingOrder(payload);
    setConfirmOpen(true);
  };

  const handleConfirmOrder = () => {
    onSubmit(pendingOrder);
    setConfirmOpen(false);
    onClose();
    setQuantity(1);
    setPhoneNumber("");
    setSuccessOpen(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 4, px: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#1a1a1a' }}>
            Complete Your Order
          </Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {/* 1. PRODUCT SUMMARY */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#fcfcfc', borderRadius: 3, borderStyle: 'dashed' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1" fontWeight={800} color="#FF5200">{food.foodname}</Typography>
                <Typography variant="caption" color="textSecondary">Premium {food.mealtype} • {food.foodtype}</Typography>
              </Box>

              <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: '#fff', border: '1px solid #ddd', borderRadius: 2, p: 0.5 }}>
                <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))}><RemoveIcon fontSize="small" /></IconButton>
                <Typography fontWeight={700} sx={{ minWidth: 20, textAlign: 'center' }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity(quantity + 1)}><AddIcon fontSize="small" /></IconButton>
              </Stack>
            </Stack>
          </Paper>

          {/* 2. ADDRESS SELECTION */}
          <Typography variant="subtitle2" fontWeight={800} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HomeIcon fontSize="small" color="primary" /> Delivery Address
          </Typography>

          <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
            {addresses.length === 0 ? (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/profile")}
                sx={{ py: 2, borderRadius: 3, borderStyle: 'dashed' }}
              >
                + Add New Address in Profile
              </Button>
            ) : (
              addresses.map((addr) => (
                <Paper
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr)}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    cursor: "pointer",
                    borderRadius: 3,
                    transition: '0.2s',
                    border: selectedAddress?.id === addr.id ? "2px solid #FF5200" : "1px solid #e0e0e0",
                    bgcolor: selectedAddress?.id === addr.id ? "#fff9f6" : "#fff",
                    '&:hover': { bgcolor: '#fdfdfd' }
                  }}
                >
                  <Typography variant="body2" fontWeight={800} color={selectedAddress?.id === addr.id ? "#FF5200" : "textPrimary"}>
                    {addr.label}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    {addr.addressLine}, {addr.city} - {addr.pincode}
                  </Typography>
                </Paper>
              ))
            )}
          </Box>

          {/* 3. CONTACT INFO */}
          <Typography variant="subtitle2" fontWeight={800} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneAndroidIcon fontSize="small" color="primary" /> Contact Details
          </Typography>
          <TextField
            placeholder="Enter 10-digit mobile number"
            fullWidth
            size="small"
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            helperText="You can change this number for this order"
            inputProps={{ maxLength: 10 }}
            error={phonenumber.length > 0 && phonenumber.length !== 10}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          {/* 4. TOTAL BILL SECTION */}
          <Box sx={{ mt: 4, p: 2.5, bgcolor: '#1a1a1a', borderRadius: 4, color: '#fff' }}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Item Total ({quantity}x)</Typography>
              <Typography variant="body2" fontWeight={600}>₹{totalPrice}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Delivery Fee</Typography>
              <Typography variant="body2" color="#4caf50" fontWeight={600}>FREE</Typography>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={800}>To Pay</Typography>
              <Typography variant="h6" fontWeight={800} color="#FF5200">₹{totalPrice}</Typography>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!isValidPhoneNumber(phonenumber) || !selectedAddress}
            onClick={handlePrepareOrder}
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              background: "linear-gradient(135deg, #FF5200, #ff7b39)",
              boxShadow: '0 8px 20px rgba(255, 82, 0, 0.3)',
              '&:hover': { background: "#e64a19" }
            }}
          >
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={confirmOpen} PaperProps={{ sx: { borderRadius: 4 } }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: '#fff3e0', color: '#FF5200', width: 60, height: 60, mx: 'auto', mb: 2 }}>
            <ShoppingBagIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" fontWeight={800}>Confirm Your Meal?</Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            We will start preparing your <b>{food.foodname}</b> immediately after confirmation.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button fullWidth onClick={() => setConfirmOpen(false)} sx={{ fontWeight: 700 }}>Back</Button>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleConfirmOrder}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Yes, Order!
            </Button>
          </Stack>
        </Box>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 3, fontWeight: 700 }}>
          Order placed! Preparation started... 🍽️
        </Alert>
      </Snackbar>
    </>
  );
}