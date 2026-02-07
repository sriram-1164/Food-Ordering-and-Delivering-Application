import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar, Box, Typography } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useState } from "react";
import { CrudService } from "../services/CrudService";
import { AddUserDetails } from "../services/Model";
import React from "react";

const SignupDialog = () => {


  const crud = CrudService()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber,setPhoneNumber]=useState("")
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }
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
    setError("");
    setLoading(true);

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

      const newUser: AddUserDetails = {
        userId: Date.now(),
        username,
        password,
        role: "user", //  FORCE USER ROLE
        phonenumber
      };

      await crud.addUser(newUser);

      alert("Signup successful. Please login.");
      handleClose();
      setUsername("");
      setPassword("");
    } catch (err) {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
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
            position: "absolute",
            right: 70,
            top: 100,
            height: "60vh",
            borderRadius: 3,
             backgroundColor: "#b3effc"
          },
        }}
      >
   

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
            <Typography variant="h6" fontWeight="bold" align="center">
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
            error={Boolean(error)}
            helperText={error}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            error={Boolean(error)}
            helperText={error}
            onChange={(e) => setPassword(e.target.value)}
          />
            <TextField
            label="Phonenumber"
            
            fullWidth
            margin="normal"
            value={phonenumber}
            error={Boolean(error)}
            helperText={error}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </DialogContent>


        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={handleSignup}
          >
            Signup
          </Button>
        </DialogActions>
      </Dialog>
      
    </React.Fragment>
  );
};

export default SignupDialog;


