import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { CrudService } from "../services/CrudService";
import { AddUserDetails } from "../services/Model";
import React from "react";
import { useRef } from "react";


import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";

const SignupDialog = () => {
  const crud = CrudService();

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpVerified, setOtpVerified] = useState(false);

  const [error, setError] = useState("");
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);


  /* ---------------- VALIDATION ---------------- */
  const isValidPhoneNumber = (phone: string) =>
    /^[6-9]\d{9}$/.test(phone);

  /* ---------------- OPEN / CLOSE ---------------- */
  const handleOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setPhoneNumber("");
    setOtp("");
    setConfirmationResult(null);
    setOtpVerified(false);
    setError("");
  };

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (!isValidPhoneNumber(phonenumber)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setError("");

      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const result = await signInWithPhoneNumber(
        auth,
        `+91${phonenumber}`,
        recaptchaRef.current
      );

      setConfirmationResult(result);
      alert("OTP sent successfully");
    } catch (error: any) {
      console.error("OTP ERROR:", error);
      setError(error.message || "Failed to send OTP");
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;

    try {
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
      setError("");
      alert("OTP verified successfully");
    } catch {
      setError("Invalid OTP");
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignup = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password.length <= 3) {
      setError("Password must be more than 3 characters");
      return;
    }

    if (!otpVerified) {
      setError("Please verify OTP before signup");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const users = await crud.getUsers();

      const alreadyExists = users.some(
        (u: any) => u.username === username
      );

      if (alreadyExists) {
        setError("Username already exists");
        setLoading(false);
        return;
      }

      const timestamp = Date.now();

      const newUser: AddUserDetails = {
        id: timestamp,            // 👈 JSON SERVER ID
        userId: timestamp,        // 👈 APP USER ID
        username,
        password,
        role: "user",
        phonenumber,
        profileImage: ""
      };

      await crud.addUser(newUser);

      alert("Signup successful. Please login.");
      handleClose();
    } catch {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="info"
        sx={{ mt: 2 }}
        onClick={handleOpen}
      >
        Sign Up
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "#b3effc",
          },
        }}
      >
        {/* REQUIRED FOR FIREBASE */}
        <div id="recaptcha-container"></div>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={2}
        >
          <Avatar sx={{ bgcolor: "info.main", mb: 1 }}>
            <PersonAddIcon />
          </Avatar>

          <DialogTitle sx={{ pb: 0 }}>
            <Typography variant="h6" fontWeight="bold">
              Create Account
            </Typography>
          </DialogTitle>
        </Box>

        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Mobile Number"
            fullWidth
            margin="normal"
            value={phonenumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value.replace(/\D/g, ""))
            }
            inputProps={{ maxLength: 10 }}
          />

          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={handleSendOtp}
          >
            Send OTP
          </Button>

          {confirmationResult && (
            <>
              <TextField
                label="Enter OTP"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                inputProps={{ maxLength: 6 }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1 }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </Button>
            </>
          )}

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            color="info"
            disabled={!otpVerified || loading}
            onClick={handleSignup}
          >
            Signup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignupDialog;