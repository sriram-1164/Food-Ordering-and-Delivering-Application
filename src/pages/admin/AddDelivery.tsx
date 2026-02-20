import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Paper,
  InputAdornment,
  Grid,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LockIcon from "@mui/icons-material/Lock";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { CrudService } from "../../services/CrudService";
import BackButton from "../../components/common/BackButton";

const crud = CrudService();

const AddDelivery = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!username || !password || !phonenumber) {
      setError("Please fill all fields");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phonenumber)) {
      setError("Enter valid 10-digit phone number");
      return;
    }

    const newDelivery = {
      id: Date.now().toString(),
      userId: Date.now(),
      username,
      password,
      phonenumber,
      role: "delivery",
      isOnline: false,
      isBusy: false,
    };

    try {
      await crud.addUser(newDelivery as any);
      setUsername("");
      setPassword("");
      setPhonenumber("");
      setOpen(true);
      setError("");
    } catch (err) {
      setError("Failed to add delivery partner");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#fdfdfd" }}>
      {/* SIDEBAR IMAGE SECTION (Food Delivery Aesthetic) */}
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid
          size={{xs:12, md:6}}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(rgba(0,0,0,0.3), rgb(227, 85, 85)), url('https://images.unsplash.com/photo-1526367790999-015078648402?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            p: 6,
            color: "#fff",
            position: "relative"
          }}
        >
          <Box sx={{ p: 3, position: "absolute", top: 0, left: 0 }}>
            <BackButton to="/adminorders" color="error" />
          </Box>
            <Box sx={{ textAlign: 'center', backdropFilter: 'blur(4px)', p: 4, borderRadius: 4, border: '1px solid rgba(255,255,255,0.3)' }}>
              
                <FastfoodIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h3" fontWeight="900">Join the Fleet</Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, mt: 1 }}>
                    Helping thousands of people get <br/> their favorite meals on time.
                </Typography>
            </Box>
        </Grid>

        {/* FORM SECTION */}
        <Grid size={{xs:12, md:6}}  sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
          

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, md: 8 } }}>
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                maxWidth: 450,
                bgcolor: "transparent",
              }}
            >
              {/* BRANDING */}
              <Box mb={5}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#d32f2f", display: 'flex', alignItems: 'center', gap: 1 }}>
                   <LocalShippingIcon fontSize="large" /> Partner Registration
                </Typography>
                <Typography variant="body1" sx={{ color: "#546e7a", mt: 1, fontWeight: 500 }}>
                  Create a secure account for the new delivery executive.
                </Typography>
              </Box>

              {/* FORM FIELDS */}
              <Stack spacing={3}>
                <TextField
                  label="Full Name"
                  variant="standard" // Clean, modern look
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#d32f2f" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Phone Number"
                  variant="standard"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value.replace(/\D/g, ""))}
                  inputProps={{ maxLength: 10 }}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon sx={{ color: "#d32f2f" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Create Password"
                  type="password"
                  variant="standard"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#d32f2f" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box pt={2}>
                    <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{
                        py: 2,
                        borderRadius: "50px", // Capsule button
                        fontWeight: "bold",
                        fontSize: "1rem",
                        textTransform: "none",
                        bgcolor: "#d32f2f", // Food delivery Red (Zomato/Swiggy style)
                        boxShadow: "0 8px 16px rgba(211, 47, 47, 0.3)",
                        "&:hover": {
                            bgcolor: "#b71c1c",
                            boxShadow: "0 10px 20px rgba(211, 47, 47, 0.4)",
                        },
                    }}
                    >
                    Register Partner
                    </Button>
                </Box>
              </Stack>

              {/* ILLUSTRATION SUB-TEXT */}
              <Box sx={{ mt: 6, p: 2, bgcolor: "#fff8f1", borderRadius: 3, border: '1px dashed #ffcc80' }}>
                 <Typography variant="caption" color="#e65100" fontWeight="bold">
                     NOTICE:
                 </Typography>
                 <Typography variant="caption" display="block" color="textSecondary">
                     Ensure the phone number is active. This will be used for order SMS notifications and live tracking updates.
                 </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* NOTIFICATIONS */}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="success" variant="filled" sx={{ borderRadius: "10px" }}>
          ✅ Partner added to the fleet!
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: "10px" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddDelivery;