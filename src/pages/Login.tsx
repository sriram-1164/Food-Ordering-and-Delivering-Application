import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  InputAdornment,
  Container,
} from "@mui/material";
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import { CrudService } from "../services/CrudService";
import SignupDialog from "../pages/SignUp";

export default function Login() {
  const crud = CrudService();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and Password are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const users = await crud.getUsers();
      const matchedUser = users.find(
        (u) =>
          u.username === username &&
          u.password === password
      );
      await delay(3000);
      if (!matchedUser) {
        setError("Invalid username or password");
        return;
      }
      localStorage.setItem("user", JSON.stringify(matchedUser));
      localStorage.setItem("role", matchedUser.role);
      
      if (matchedUser.role === "admin") {
        navigate("/adminmenu");
      } else if (matchedUser.role === "delivery") {
        navigate("/delivery");
      } else {
        navigate("/usermenu");
      }
    } catch (err) {
      await delay(3000);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <React.Fragment>
      {/* MAIN CONTAINER WITH BACKGROUND IMAGE */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          // The main background: A high-end dark food flat-lay
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          alignItems: "center",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        {/* DECORATIVE FLOATING FOOD ELEMENTS (Visible on Desktop) */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            position: "absolute",
            left: "5%",
            top: "15%",
            width: "40%",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: "rgba(255,255,255,0.1)",
              lineHeight: 0.8,
              fontSize: "8rem",
              mb: 2,
            }}
          >
            QUICK<br />CRAVINGS
          </Typography>
          <Typography variant="h5" sx={{ color: "#fff", opacity: 0.8, maxWidth: 400 }}>
            Experience the finest culinary delights delivered straight to your doorstep. 
          </Typography>
        </Box>

        {/* LOGIN CARD SECTION */}
        <Container maxWidth="sm" sx={{ zIndex: 2, mr: { md: "10%" } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 8,
              // GLASSMORPHISM EFFECT
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              textAlign: "center",
            }}
          >
            {/* BRANDING */}
            <Box mb={4}>
              <Avatar
                sx={{
                  bgcolor: "#ff5722",
                  width: 70,
                  height: 70,
                  margin: "0 auto 16px",
                  boxShadow: "0 8px 16px rgba(255,87,34,0.4)",
                }}
              >
                <LockOutlineIcon sx={{ fontSize: 35 }} />
              </Avatar>
              <Typography
                variant="h4"
                fontWeight="900"
                sx={{
                  background: "linear-gradient(135deg, #ec9d26, #ff5722)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The food you love is just a login away 🍽️
              </Typography>
            </Box>

            {/* ERROR MESSAGE */}
            {error && (
              <Box 
                sx={{ 
                  bgcolor: "rgba(211, 47, 47, 0.1)", 
                  p: 1.5, 
                  borderRadius: 2, 
                  mb: 2, 
                  border: "1px solid rgba(211, 47, 47, 0.3)" 
                }}
              >
                <Typography color="error" variant="body2" fontWeight="bold">
                  {error}
                </Typography>
              </Box>
            )}

            {/* INPUT FIELDS */}
            <Box component="form" noValidate>
              <TextField
                fullWidth
                placeholder="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: "#ff5722" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 4, bgcolor: "#fff" }
                }}
              />
              <TextField
                fullWidth
                placeholder="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon sx={{ color: "#ff5722" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 4, bgcolor: "#fff" }
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{
                  mt: 4,
                  py: 1.8,
                  borderRadius: 4,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  backgroundColor: "#ff5722",
                  boxShadow: "0 10px 20px rgba(255,87,34,0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#e64a19",
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 25px rgba(255,87,34,0.4)",
                  },
                }}
              >
                Sign In to QuickCravings 🤤
              </Button>

              <Box mt={3}>
                <Typography variant="body2" color="text.secondary" display="inline">
                  Don't have an account? 
                </Typography>
                <Box sx={{ display: "inline-block", ml: 1 }}>
                  <SignupDialog />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </React.Fragment>
  );
}