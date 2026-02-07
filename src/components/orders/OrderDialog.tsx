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
} from "@mui/material";
import { useState } from "react";

export default function OrderDialog({ open, food, onClose, onSubmit }: any) {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  // const [date, setDate] = useState("");
  const [phonenumber, setPhoneNumber] = useState("")

  // confirmation + snackbar
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  const isValidPhoneNumber = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };


  if (!food) return null;

  // const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const user = JSON.parse(localStorage.getItem("user") || "{}");



  const handlePrepareOrder = () => {

    if (!isValidPhoneNumber(phonenumber)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    const payload = {
      userId: String(user.userId),
      username: user.username,
      foodId: food.foodId,
      foodname: food.foodname,
      price: food.price,
      mealtype: food.mealtype,
      foodtype: food.foodtype,
      quantity,
      address,
      date: new Date().toISOString(),
      status: "Preparing",
      phonenumber,
    };

    setPendingOrder(payload);
    setConfirmOpen(true);
  };

  /* ----------------  CONFIRM ORDER ---------------- */
  const handleConfirmOrder = () => {
    onSubmit(pendingOrder);

    setConfirmOpen(false);
    onClose();

    setQuantity(1);
    setAddress("");
    // setDate("");
    setPhoneNumber("")

    setSuccessOpen(true); //  show snackbar
  };

  /* ----------------  CANCEL CONFIRM ---------------- */
  const handleCancelConfirm = () => {
    setConfirmOpen(false);
    setPendingOrder(null);
  };

  return (
    <>

      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" className="order">
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
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <TextField
            label="Delivery Address"
            fullWidth
            multiline
            rows={2}
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            value={phonenumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove non-digits
              setPhoneNumber(value);
            }}
            inputProps={{
              maxLength: 10,           // Indian mobile number length
              inputMode: "numeric",    // mobile keypad
              pattern: "[0-9]*",
            }}
            error={phonenumber.length > 0 && phonenumber.length !== 10}
            helperText={
              phonenumber.length > 0 && phonenumber.length !== 10
                ? "Mobile number must be 10 digits"
                : ""
            }
          />


          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={
                !isValidPhoneNumber(phonenumber) || !address.trim()
              }
              sx={{
                px: 3,
                background: "linear-gradient(135deg, #ff5722, #ff9800)",
                ":hover": {
                  background:
                    "linear-gradient(135deg, #e64a19, #fb8c00)",
                },
              }}
              onClick={handlePrepareOrder}
            >
              Submit Order
            </Button>
          </Box>
        </DialogContent>
      </Dialog>


      <Dialog open={confirmOpen} onClose={handleCancelConfirm} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Confirm Order
        </DialogTitle>

        <DialogContent>
          <Typography align="center">
            Are you sure you want to place this order?
          </Typography>

          <Box mt={2}>
            <Typography><b>Food:</b> {food.foodname}</Typography>
            <Typography><b>Quantity:</b> {quantity}</Typography>
            <Typography>
              <b>Total Price:</b> ₹{quantity * food.price}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button color="inherit" onClick={handleCancelConfirm}>
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4caf50, #2e7d32)",
            }}
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessOpen(false)}
        >
          Order placed successfully! இன்னக்கி ஒரு புடி🕺
        </Alert>
      </Snackbar>
    </>
  );
}
