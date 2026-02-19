import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
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
    <React.Fragment>
          <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        position: "relative", // 🔥 IMPORTANT
      }}
    >

      {/* 🔥 BACK BUTTON TOP LEFT */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
      >
        <BackButton to="/adminorders" />
      </Box>
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      
     
    <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          p: 4,
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <Box textAlign="center" mb={3}>
          <LocalShippingIcon
            sx={{ fontSize: 50, color: "#ff9800" }}
          />
          <Typography
            variant="h4"
            fontWeight="bold"
            mt={1}
          >
            Add Delivery Partner
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Register new delivery executive
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />

              <TextField
                label="Phone Number"
                value={phonenumber}
                onChange={(e) =>
                  setPhonenumber(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                inputProps={{ maxLength: 10 }}
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: "bold",
                  background:
                    "linear-gradient(135deg, #ff9800, #ff5722)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #fb8c00, #e64a19)",
                  },
                }}
              >
                Add Delivery Partner
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Paper>
      

      {/* SUCCESS SNACKBAR */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setOpen(false)}
        >
          🚚 Delivery Partner Added Successfully
        </Alert>
      </Snackbar>

      {/* ERROR SNACKBAR */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
    </Box>
    
    </React.Fragment>
  );
};

export default AddDelivery;
