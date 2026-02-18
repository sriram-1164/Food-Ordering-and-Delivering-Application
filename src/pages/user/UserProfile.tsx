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
  CardContent,
  Card,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { CrudService } from "../../services/CrudService";
import { Address, UserDetails } from "../../services/Model";
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

  const [email, setEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");


  const [addresses, setAddresses] = useState<Address[]>([]);

  const [openAddress, setOpenAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
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
      formData.append("userId", user.id.toString());

      const uploadRes = await crud.uploadProfileImage(formData);
      console.log(uploadRes);
      const imageUrl = uploadRes.data.imageUrl;

      // await axios.patch(
      //   `http://localhost:3001/users/${user.id}`,
      //   { profileImage: imageUrl }
      // );
      await crud.updateUser(user.id, { profileImage: imageUrl });


      setUser({ ...user, profileImage: imageUrl });
      setSelectedFile(null);
      showSnackbar("Profile photo updated 📸");

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
      // await axios.patch(
      //   `http://localhost:3001/users/${user.id}`,
      //   {
      //     username: editUsername,
      //     phonenumber: editPhone,
      //   }
      // );
      await crud.updateUser(user.id, {
        username: editUsername,
        phonenumber: editPhone
      });


      setUser({
        ...user,
        username: editUsername,
        phonenumber: editPhone,
      });

      setOpenEdit(false);
      showSnackbar("Profile updated successfully");
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
      // await axios.patch(
      //   `http://localhost:3001/users/${user.id}`,
      //   { password: newPassword }
      // );
      await crud.updateUser(user.id, { password: newPassword });

      setUser({ ...user, password: newPassword });
      setOpenPassword(false);
      // alert("Password updated successfully");
      showSnackbar("Password changed successfully 🔐");

    } catch (err) {
      console.error("Failed to update password", err);
      alert("Password update failed");
    }
  };

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (user?.addresses) setAddresses(user.addresses);
  }, [user]);

  const handleOpenAddress = () => {
    setAddressLabel("Home");
    setAddressLine("");
    setCity("");
    setPincode("");
    setOpenAddress(true);
  };

  const handleCloseAddress = () => {
    setOpenAddress(false);
  };

  const handleSaveAddress = async () => {
    if (!user) return;

    if (!addressLine.trim() || !city.trim() || !pincode.trim()) {
      alert("Please fill all address fields");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Enter valid 6-digit pincode");
      return;
    }

    const fullAddress = `${addressLine}, ${city}, Tamil Nadu, India, ${pincode}`;

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(fullAddress)}`
        ,
        {
          headers: {
            "User-Agent": "FoodPointApp/1.0"
          }
        }
      );

      const geoData = await geoRes.json();

      if (!geoData.length) {
        alert("Location not found. Please enter valid address.");
        return;
      }

      const lat = parseFloat(geoData[0].lat);
      const lng = parseFloat(geoData[0].lon);

      const newAddress = {
        id: Date.now(),
        label: addressLabel,
        addressLine,
        city,
        pincode,
        lat,
        lng,
      };

      const updatedAddresses = user.addresses
        ? [...user.addresses, newAddress]
        : [newAddress];

      await crud.updateUser(user.id, {
        addresses: updatedAddresses,
      });

      setUser({
        ...user,
        addresses: updatedAddresses,
      });

      setOpenAddress(false);
      showSnackbar("Address added successfully 🏠");

    } catch (err) {
      console.error("Geocoding failed:", err);
      alert("Address save failed");
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

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-z0-9.]+@[a-z0-9.]+\.[a-z]{2,}$/;
    return emailRegex.test(value);
  };



  const handleSaveEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (email === user.email) {
      setEditingEmail(false);
      return;
    }

    try {
      // await axios.patch(
      //   `http://localhost:3001/users/${user.id}`,
      //   { email }
      // );
      await crud.updateUser(user.id, { email: email });

      setUser({ ...user, email });
      setEditingEmail(false);
      showSnackbar("Email Updated");
    } catch (error) {
      console.error("Error updating email", error);
    }
  };
  const handleEditEmail = () => {
    setEmail(user.email || "");
    setEditingEmail(true);
  };
  return (
    <React.Fragment>
      <Box className="order">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box sx={{ position: "absolute", top: 16, left: 16 }}>
            <BackButton to="/usermenu" />
          </Box>
          <Card
            sx={{
              maxWidth: 800,
              width: "100%",
              borderRadius: 4,
              boxShadow: "0 20px 40px rgba(241, 29, 29, 0.23)",
              overflow: "hidden",
            }}
          >
            <Box className="farm"
              sx={{
                background: "linear-gradient(135deg, #ddba1db6, #e9c4c4)",
                color: "#fff",
                p: 3,
                textAlign: "center",
              }}
            >
              <Avatar
                src={
                  user.profileImage
                    ? `http://localhost:3001${user.profileImage}`
                    : undefined
                }
                sx={{
                  width: 140,
                  height: 140,
                  mx: "auto",
                  mb: 1,
                  fontSize: 40,
                  bgcolor: "info.main",
                  border: "4px solid white",
                }}
              >
                {!user.profileImage &&
                  user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                {user.username}
              </Typography>
              <input
                type="file"
                hidden
                accept="image/*"
                id="profile-pic-input"
                onChange={handleFileChange}
              />
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                mt={1}
              >
                <label htmlFor="profile-pic-input">
                  <Button
                    component="span"
                    size="small"
                    variant="contained"
                    sx={{
                      px: 1,
                      borderRadius: 1,
                      background: "linear-gradient(135deg, #11a9c1, #aec518)",
                      ":hover": {
                        background: "linear-gradient(135deg, #11a9c1, #aec518)",
                      },
                    }}
                    startIcon={<PhotoCameraIcon />}
                  >
                    Change Photo
                  </Button>
                </label>
                {selectedFile && (
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      px: 1,
                      borderRadius: 1,
                      background: "linear-gradient(135deg, #11a9c1, #aec518)",
                      ":hover": {
                        background: "linear-gradient(135deg, #11a9c1, #aec518)",
                      },
                    }}
                    onClick={handleUploadProfilePic}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                )}
              </Stack>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Grid spacing={4}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Stack spacing={2}>
                    <Typography fontWeight="bold">📞 Phone</Typography>
                    <Typography color="text.secondary">
                      {user.phonenumber}
                    </Typography>
                    <Divider />
                    <Box mt={3} >
                      <Typography fontWeight="bold" mb={1}>
                        📧 Email
                      </Typography>

                      {!editingEmail ? (
                        <>
                          <Typography color="text.secondary" mb={2}>
                            {user.email || "No email added"}
                          </Typography>

                          <Button
                            variant="contained"
                            onClick={handleEditEmail}
                            sx={{
                              background: "linear-gradient(135deg, #1c4be4, #97acf0)",
                              px: 1
                            }}
                          >
                            {user.email ? "Edit Email" : "Add Email"}
                          </Button>
                        </>
                      ) : (
                        <>
                          <TextField
                            fullWidth
                            label="Enter Email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailError("");
                            }}
                            error={!!emailError}
                            helperText={emailError}
                            sx={{ mb: 2 }}
                          />

                          <Button
                            variant="contained"
                            onClick={handleSaveEmail}
                            sx={{
                              background: "linear-gradient(135deg, #1c4be4, #97acf0)",
                              px: 1
                            }}
                          >
                            Save Email
                          </Button>
                        </>
                      )}
                    </Box>

                  </Stack>
                </Grid>

                <Grid size={{ xl: 12, md: 7 }}>
                  <Stack spacing={2}>
                    <Divider />
                    <Typography fontWeight="bold">⚙️Account Actions</Typography>
                    <Box display="flex" justifyContent="flex-start">
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleOpenEdit}
                        sx={{
                          px: 1,
                          borderRadius: 1,
                          background: "linear-gradient(135deg, #f92e00, #e7c6c6)",
                          ":hover": {
                            background: "linear-gradient(135deg, #fe3103, #e7c6c6)",
                          },
                        }}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                    <Box display="flex" justifyContent="flex-start">
                      <Button
                        variant="contained"
                        sx={{
                          px: 1,
                          mb: 1,
                          borderRadius: 1,
                          background: "linear-gradient(135deg, #e04c2a, #efdada)",
                          ":hover": {
                            background: "linear-gradient(135deg, #e04c2a, #efdada)",
                          },
                        }}
                        startIcon={<LockIcon />}
                        onClick={handleOpenPassword}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
              <Divider />
              <Typography fontWeight="bold" mb={1}>🏠 Saved Addresses</Typography>
              {user.addresses?.length === 0 && (
                <Typography color="text.secondary">
                  No addresses added
                </Typography>
              )}
              {user.addresses?.map((addr) => (
                <Paper
                  key={addr.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: "#fffefc",
                  }}
                >
                  <Typography fontWeight="bold">
                    {addr.label}
                  </Typography>
                  <Typography variant="body2">
                    {addr.addressLine}, {addr.city} - {addr.pincode}
                  </Typography>
                </Paper>
              ))}
              <Button
                sx={{
                  px: 1,
                  background: "linear-gradient(135deg, #cbb132, #ed3916)",
                  ":hover": {
                    background: "linear-gradient(135deg, #cbb132, #ed3916)",
                  },
                }}
                variant="contained"
                onClick={handleOpenAddress}
              >
                + Add New Address
              </Button>
            </CardContent>
          </Card>
          <Dialog
            open={openEdit}
            onClose={handleCloseEdit}
            fullWidth
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 4,
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #4b93f0, #ff9800)",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              ✏️ Edit Profile
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
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
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleCloseEdit} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #ebebe1, #ff9800)",
                }}
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openPassword}
            onClose={handleClosePassword}
            fullWidth
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 4,
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #4b93f0, #ff9800)",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              🔒 Change Password
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
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
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClosePassword} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #ebebe1, #ff9800)",
                }}
                onClick={handleChangePassword}
              >
                Update Password
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openAddress}
            onClose={handleCloseAddress}
            fullWidth
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 4,
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #4b93f0, #ff9800)",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              🏠 Add New Address
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <TextField
                select
                label="Address Type"
                fullWidth
                margin="normal"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </TextField>
              <TextField
                label="Address"
                fullWidth
                multiline
                rows={2}
                margin="normal"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
              <TextField
                label="City"
                fullWidth
                margin="normal"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <TextField
                label="Pincode"
                fullWidth
                margin="normal"
                value={pincode}
                inputProps={{ maxLength: 6 }}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, ""))
                }
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleCloseAddress} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #ebebe1, #ff9800)",
                }}
                onClick={handleSaveAddress}
              >
                Save Address
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};
export default UserProfile;
