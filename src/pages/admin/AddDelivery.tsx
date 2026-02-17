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
  Alert
} from "@mui/material";
import { CrudService } from "../../services/CrudService";

const crud = CrudService();

const AddDelivery = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const newDelivery = {
      id: Date.now(),
      userId: Date.now(),
      username,
      password,
      phonenumber,
      role: "delivery",
      isOnline: false,   // 🔥 default offline
      isBusy: false,
    };

    await crud.addUser(newDelivery as any);

    setUsername("");
    setPassword("");
    setPhonenumber("");
    setOpen(true);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Add Delivery Partner
      </Typography>

      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />

            <TextField
              label="Phone Number"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
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
              onClick={handleSubmit}
            >
              Add Delivery Partner
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success">
          Delivery Partner Added Successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddDelivery;
