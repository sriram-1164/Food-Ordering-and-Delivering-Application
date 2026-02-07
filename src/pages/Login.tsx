import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import LockOutlineIcon from '@mui/icons-material/LockOutline';
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
  console.log(username, password)

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

      //  ROLE-BASED NAVIGATION
      if (matchedUser.role === "admin") {
        navigate("/adminmenu");
      } else {
        navigate("/usermenu");
      } setLoading(true)
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
      <Box className="login">

        <Box
          minHeight="100vh"
          display="flex"
          flexDirection={"column"}
          justifyContent="right"
          alignItems="end"
          padding={5}

        >
          <Box
            display={"flex"}
            justifyContent={"center"}
            textAlign={"center"}
            flexDirection={"column"}
            >
            <Typography variant="h3" fontWeight="bold"
              sx={{
                background: "linear-gradient(135deg,  #ec9d26, #ff5722)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              அன்னபூரணா வலைத்தளத்திற்கு வரவேற்கிறோம்
              <span
                style={{
                  marginLeft: "8px",
                  WebkitTextFillColor: "initial", // remove gradient
                  color: "red",                   // original heart color
                }}
              >
                🙏🙂
              </span>
            </Typography>

          </Box>
          <Paper
            elevation={10}
            sx={{
              p: 4,
              width: 360,
              borderRadius: 3,
              marginRight: "10rem"
            }}
          >
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar sx={{ bgcolor: "#ff5722", width: 56, height: 56 }}>
                <LockOutlineIcon />
              </Avatar>
            </Box>

            <Typography variant="h5" align="center" fontWeight="bold">
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={2}
            >
              Please login to continue
            </Typography>

            {error && (
              <Typography color="error" variant="body2" align="center" mb={1}>
                {error}
              </Typography>
            )}

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: 2,
                backgroundColor: "#ff5722",
                ":hover": { backgroundColor: "#e64a19" },
              }}
              onClick={handleLogin}
            >
              Login🤤
            </Button>


            <Box textAlign="center" mt={2}>
              <SignupDialog />
            </Box>
          </Paper>
        </Box>
      </Box>
    </React.Fragment>
  );
}