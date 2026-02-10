import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Stack,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { CrudService } from "../../services/CrudService";
import { UserDetails } from "../../services/Model";
import axios from "axios";
import BackButton from "../../components/common/BackButton";

const UserProfile = () => {
  const crud = CrudService();

  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [openPassword, setOpenPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        if (!loggedUser?.userId) {
          setUser(null);
          return;
        }

        const users = await crud.getUsers();
        const currentUser = users.find(
          (u: UserDetails) => u.userId === loggedUser.userId
        );

        setUser(currentUser || null);
      } catch (err) {
        console.error("Failed to load profile", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadProfilePic = async () => {
    if (!selectedFile || !user) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("userId", user.userId.toString());

      const uploadRes = await crud.uploadProfileImage(formData);
      const imageUrl = uploadRes.data.imageUrl;

      await axios.patch(
        `http://localhost:3001/users/${user.id}`,
        { profileImage: imageUrl }
      );

      setUser({ ...user, profileImage: imageUrl });
      setSelectedFile(null);
    } catch (err) {
      console.error("Profile image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleOpenEdit = () => {
    if (!user) return;
    setEditUsername(user.username);
    setEditPhone(user.phonenumber);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!editUsername.trim()) {
      alert("Username cannot be empty");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(editPhone)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      // PATCH only changed fields
      await axios.patch(
        `http://localhost:3001/users/${user.id}`,
        {
          username: editUsername,
          phonenumber: editPhone,
        }
      );

      // Update UI state
      setUser({
        ...user,
        username: editUsername,
        phonenumber: editPhone,
      });

      setOpenEdit(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Profile update failed");
    }
  };

  const handleOpenPassword = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOpenPassword(true);
  };

  const handleClosePassword = () => {
    setOpenPassword(false);
  };

  const handleChangePassword = async () => {
    if (!user) return;

    if (oldPassword !== user.password) {
      alert("Old password is incorrect");
      return;
    }

    if (newPassword.length <= 3) {
      alert("New password must be more than 3 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3001/users/${user.id}`,
        { password: newPassword }
      );

      setUser({ ...user, password: newPassword });
      setOpenPassword(false);
      alert("Password updated successfully");
    } catch (err) {
      console.error("Failed to update password", err);
      alert("Password update failed");
    }
  };



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography align="center" mt={6} color="error">
        User not found
      </Typography>
    );
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      pt={6}
      sx={{
        background: "linear-gradient(135deg, #f52922, #ffcc80)",
      }}
    >
      <Box mb={2}>
        <BackButton to="/usermenu" />
      </Box>
      <Paper
        elevation={6}
        sx={{
          width: 620,
          p: 4,
          borderRadius: 8,
        }}
      >
        {/* PROFILE HEADER */}
        <Stack alignItems="center" spacing={1}>
          <Avatar
            src={
              user.profileImage
                ? `http://localhost:3002${user.profileImage}`
                : undefined
            }
            sx={{
              width: 110,
              height: 110,
              bgcolor: "info.main",
              fontSize: 36,
            }}
          >
            {!user.profileImage &&
              user.username.charAt(0).toUpperCase()}
          </Avatar>

          <input
            type="file"
            hidden
            accept="image/*"
            id="profile-pic-input"
            onChange={handleFileChange}
          />

          <label htmlFor="profile-pic-input">
            <Button
              startIcon={<PhotoCameraIcon />}
              size="small"
              variant="outlined"
              component="span"
            >
              Change Photo
            </Button>
          </label>

          {selectedFile && (
            <Button
              variant="contained"
              size="small"
              onClick={handleUploadProfilePic}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* PROFILE DETAILS */}
        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            {user.username}
          </Typography>

          <Typography color="text.secondary" mt={1}>
            📞 {user.phonenumber}
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Role: {user.role}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ACTIONS (DESIGN ONLY) */}
        <Stack spacing={1}>
          <Button
            fullWidth
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={handleOpenEdit}
          >
            Edit Profile
          </Button>

          <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="xs">
            <DialogTitle>Edit Profile</DialogTitle>

            <DialogContent>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />

              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={editPhone}
                inputProps={{ maxLength: 10 }}
                onChange={(e) =>
                  setEditPhone(e.target.value.replace(/\D/g, ""))
                }
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseEdit}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveProfile}>
                Save
              </Button>
            </DialogActions>
          </Dialog>


          <Button
            fullWidth
            startIcon={<LockIcon />}
            variant="outlined"
            onClick={handleOpenPassword}
          >
            Change Password
          </Button>
        </Stack>
        <Dialog open={openPassword} onClose={handleClosePassword} fullWidth maxWidth="xs">
          <DialogTitle>Change Password</DialogTitle>

          <DialogContent>
            <TextField
              label="Old Password"
              type="password"
              fullWidth
              margin="normal"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />

            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClosePassword}>Cancel</Button>
            <Button variant="contained" onClick={handleChangePassword}>
              Update
            </Button>
          </DialogActions>
        </Dialog>


        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          mt={3}
        >
          Password is hidden for security reasons
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserProfile;
