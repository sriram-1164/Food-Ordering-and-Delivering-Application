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
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useRef } from "react";
import { CrudService } from "../services/CrudService";
import { AddUserDetails } from "../services/Model";
import React from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
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

  const isValidPhoneNumber = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleOpen = () => setOpenDialog(true);

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

  const handleSendOtp = async () => {
    if (!isValidPhoneNumber(phonenumber)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setError("");
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const result = await signInWithPhoneNumber(
        auth,
        `+91${phonenumber}`,
        recaptchaRef.current
      );

      setConfirmationResult(result);
    } catch (error: any) {
      setError(error.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
      setError("");
    } catch {
      setError("Invalid OTP code. Please try again.");
    }
  };

  const handleSignup = async () => {
    if (!username.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    if (password.length <= 3) {
      setError("Password is too short");
      return;
    }
    if (!otpVerified) {
      setError("Please verify your phone number first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const users = await crud.getUsers();
      const alreadyExists = users.some((u: any) => u.username === username);

      if (alreadyExists) {
        setError("This username is already taken");
        setLoading(false);
        return;
      }

      const timestamp = Date.now();
      const newUser: AddUserDetails = {
        id: timestamp,
        userId: timestamp,
        username,
        password,
        role: "user",
        phonenumber,
        profileImage: "",
      };

      await crud.addUser(newUser);
      handleClose();
    } catch {
      setError("Signup failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography
        variant="body2"
        sx={{
          color: "#ff5722",
          fontWeight: "bold",
          cursor: "pointer",
          textDecoration: "underline",
          "&:hover": { color: "#e64a19" },
        }}
        onClick={handleOpen}
      >
        Create an account
      </Typography>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 6,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            p: 1,
          },
        }}
      >
        <div id="recaptcha-container"></div>

        {/* Header with Close Icon */}
        <Box display="flex" justifyContent="flex-end" px={1} pt={1}>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" px={3}>
          <Avatar
            sx={{
              bgcolor: otpVerified ? "#4caf50" : "#ff5722",
              width: 60,
              height: 60,
              mb: 2,
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
          >
            {otpVerified ? (
              <VerifiedUserIcon sx={{ fontSize: 35 }} />
            ) : (
              <PersonAddIcon sx={{ fontSize: 35 }} />
            )}
          </Avatar>

          <Typography variant="h5" fontWeight="900" color="#333">
            Join QuickCravings
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
            Create an account to start ordering your favorite meals
          </Typography>
        </Box>

        <DialogContent sx={{ px: 4 }}>
          {error && (
            <Fade in={!!error}>
              <Typography
                color="error"
                variant="caption"
                display="block"
                textAlign="center"
                sx={{ bgcolor: "#ffebee", p: 1, borderRadius: 2, mb: 2, fontWeight: "bold" }}
              >
                {error}
              </Typography>
            </Fade>
          )}

          <TextField
            label="Choose Username"
            fullWidth
            margin="dense"
            variant="standard"
            value={username}
            disabled={otpVerified}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Set Password"
            type="password"
            fullWidth
            margin="dense"
            variant="standard"
            value={password}
            disabled={otpVerified}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 3, p: 2, borderRadius: 4, bgcolor: "#f9f9f9", border: "1px solid #eee" }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              VERIFICATION
            </Typography>
            <TextField
              placeholder="Mobile Number"
              fullWidth
              margin="dense"
              value={phonenumber}
              disabled={otpVerified || !!confirmationResult}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: "#fff" },
              }}
            />

            {!confirmationResult && !otpVerified && (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1, borderRadius: 3, bgcolor: "#333" }}
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>
            )}

            {confirmationResult && !otpVerified && (
              <Fade in={true}>
                <Box mt={2}>
                  <TextField
                    label="Enter 6-digit OTP"
                    fullWidth
                    size="small"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 3 }}
                    onClick={handleVerifyOtp}
                  >
                    Verify Code
                  </Button>
                </Box>
              </Fade>
            )}

            {otpVerified && (
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1} color="success.main">
                <VerifiedUserIcon fontSize="small" />
                <Typography variant="body2" fontWeight="bold">Number Verified</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button
            fullWidth
            variant="contained"
            disabled={!otpVerified || loading}
            onClick={handleSignup}
            sx={{
              py: 1.5,
              borderRadius: 4,
              fontWeight: "bold",
              bgcolor: "#ff5722",
              boxShadow: "0 8px 20px rgba(255,87,34,0.3)",
              "&:hover": { bgcolor: "#e64a19" },
            }}
          >
            {loading ? "Creating Account..." : "Complete Signup"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SignupDialog;