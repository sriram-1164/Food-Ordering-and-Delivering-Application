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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderDialog({ open, food, onClose, onSubmit }: any) {
  /* ---------------- STATE ---------------- */
  const [quantity, setQuantity] = useState(1);
  const [phonenumber, setPhoneNumber] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const navigate = useNavigate();

  /* ---------------- USER ---------------- */
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  /* ---------------- LOAD USER ADDRESSES ---------------- */
  useEffect(() => {
    if (!open || !user?.userId) return;

    const loadAddresses = async () => {
      try {
        const res = await fetch("http://localhost:3001/users");
        const users = await res.json();

        const currentUser = users.find(
          (u: any) => u.userId === user.userId
        );

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

  /* ---------------- SAFE EARLY RETURN ---------------- */
  if (!food) return null;

  /* ---------------- HELPERS ---------------- */
  const isValidPhoneNumber = (phone: string) =>
    /^[6-9]\d{9}$/.test(phone);

  const totalPrice = quantity * food.price;

  /* ---------------- PREPARE ORDER ---------------- */
  const handlePrepareOrder = () => {
    if (!isValidPhoneNumber(phonenumber)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

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

  /* ---------------- CONFIRM ORDER ---------------- */
  const handleConfirmOrder = () => {
    onSubmit(pendingOrder);

    setConfirmOpen(false);
    onClose();
    setQuantity(1);
    setPhoneNumber("");
    setSuccessOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* ================= ORDER DIALOG ================= */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #ff5722, #ff9800)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Place Order
        </DialogTitle>

        <DialogContent>
          {/* Quantity */}
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value)))
            }
          />

          {/* TOTAL PRICE */}
          <Box
            mt={1}
            mb={2}
            p={1.5}
            borderRadius={2}
            sx={{ backgroundColor: "#fff3e0" }}
          >
            <Typography fontWeight="bold">
              Total Price: ₹{totalPrice}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* ADDRESS SELECTION */}
          <Typography fontWeight="bold" mb={1}>
            🏠 Select Delivery Address
          </Typography>

          {addresses.length === 0 && (
               <Box display="flex" justifyContent="center" p={4}>
        <Button
          variant="contained"
          size="medium"
          sx={{
            px: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #1056eb, #116bd3)",
            ":hover": {
              background: "linear-gradient(135deg, #e64a19, #fb8c00)",
            },
          }}
          onClick={() => navigate("/profile")}
        >
          Add Address in Your Profile
        </Button>
      </Box>
          )}

          {addresses.map((addr) => (
            <Paper
              key={addr.id}
              sx={{
                p: 2,
                mb: 1,
                cursor: "pointer",
                backgroundColor:
                  selectedAddress?.id === addr.id
                    ? "#ffe0b2"
                    : "#fff",
                border:
                  selectedAddress?.id === addr.id
                    ? "2px solid #ff9800"
                    : "1px solid #ddd",
              }}
              onClick={() => setSelectedAddress(addr)}
            >
              <Typography fontWeight="bold">
                {addr.label}
              </Typography>
              <Typography variant="body2">
                {addr.addressLine}, {addr.city} - {addr.pincode}
              </Typography>
            </Paper>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* PHONE NUMBER */}
          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            value={phonenumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value.replace(/\D/g, ""))
            }
            inputProps={{ maxLength: 10 }}
            error={
              phonenumber.length > 0 && phonenumber.length !== 10
            }
            helperText={
              phonenumber.length > 0 &&
              phonenumber.length !== 10
                ? "Mobile number must be 10 digits"
                : ""
            }
          />

          {/* ACTION BUTTONS */}
          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={
                !isValidPhoneNumber(phonenumber) ||
                !selectedAddress
              }
              sx={{
                px: 3,
                background:
                  "linear-gradient(135deg, #ff5722, #ff9800)",
              }}
              onClick={handlePrepareOrder}
            >
              Submit Order
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ================= CONFIRM DIALOG ================= */}
      <Dialog open={confirmOpen} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Confirm Order
        </DialogTitle>

        <DialogContent>
          <Typography align="center">
            Are you sure you want to place this order?
          </Typography>

          <Box mt={2}>
            <Typography>
              <b>Food:</b> {food.foodname}
            </Typography>
            <Typography>
              <b>Quantity:</b> {quantity}
            </Typography>
            <Typography>
              <b>Total:</b> ₹{totalPrice}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= SUCCESS ================= */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Order placed successfully! 🍽️🔥
        </Alert>
      </Snackbar>
    </>
  );
}
