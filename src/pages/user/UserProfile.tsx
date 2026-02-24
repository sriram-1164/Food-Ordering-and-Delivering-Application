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
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import { CrudService } from "../../services/CrudService";
import { Address, UserDetails } from "../../services/Model";
import BackButton from "../../components/common/BackButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";


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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);


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

  const handleEditAddress = (addr: any) => {
    setAddressLabel(addr.label);
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setPincode(addr.pincode);

    setEditingAddressId(addr.id);
    setIsEditMode(true);
    setOpenAddress(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
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
      const imageUrl = uploadRes.data.imageUrl;
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

  const handleCloseEdit = () => setOpenEdit(false);

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
      await crud.updateUser(user.id, {
        username: editUsername,
        phonenumber: editPhone,
      });
      setUser({ ...user, username: editUsername, phonenumber: editPhone });
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

  const handleClosePassword = () => setOpenPassword(false);

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
      await crud.updateUser(user.id, { password: newPassword });
      setUser({ ...user, password: newPassword });
      setOpenPassword(false);
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

  const handleCloseAddress = () => setOpenAddress(false);

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
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(fullAddress)}`,
        { headers: { "User-Agent": "FoodPointApp/1.0" } }
      );

      const geoData = await geoRes.json();

      if (!geoData.length) {
        alert("Location not found.");
        return;
      }

      const lat = parseFloat(geoData[0].lat);
      const lng = parseFloat(geoData[0].lon);

      let updatedAddresses;

      if (isEditMode && editingAddressId !== null) {
        // ✏️ UPDATE ADDRESS
        updatedAddresses = (user.addresses ?? []).map((addr: any) =>
          addr.id === editingAddressId
            ? {
              ...addr,
              label: addressLabel,
              addressLine,
              city,
              pincode,
              lat,
              lng,
            }
            : addr
        );
      } else {
        // ➕ ADD NEW ADDRESS
        const newAddress = {
          id: Date.now(),
          label: addressLabel,
          addressLine,
          city,
          pincode,
          lat,
          lng,
        };

        updatedAddresses = user.addresses
          ? [...user.addresses, newAddress]
          : [newAddress];
      }

      await crud.updateUser(user.id, { addresses: updatedAddresses });

      setUser({ ...user, addresses: updatedAddresses });

      setOpenAddress(false);
      setIsEditMode(false);
      setEditingAddressId(null);

      showSnackbar(isEditMode ? "Address updated ✏️" : "Address added 🏠");

    } catch (err) {
      console.error("Error:", err);
      alert("Operation failed");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!user) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    const updatedAddresses = (user.addresses ?? []).filter(
      (addr: any) => addr.id !== id
    );

    await crud.updateUser(user.id, { addresses: updatedAddresses });

    setUser({ ...user, addresses: updatedAddresses });

    showSnackbar("Address deleted 🗑️");
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-z0-9.]+@[a-z0-9.]+\.[a-z]{2,}$/;
    return emailRegex.test(value);
  };

  const handleSaveEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (email === user?.email) {
      setEditingEmail(false);
      return;
    }
    try {
      if (user) {
        await crud.updateUser(user.id, { email: email });
        setUser({ ...user, email });
        setEditingEmail(false);
        showSnackbar("Email Updated");
      }
    } catch (error) {
      console.error("Error updating email", error);
    }
  };

  const handleEditEmail = () => {
    setEmail(user?.email || "");
    setEditingEmail(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: "#ff5722" }} />
      </Box>
    );
  }

  if (!user) return <Typography align="center" mt={6} color="error">User not found</Typography>;

  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          pb: 10,
        }}
      >
        <Box sx={{ p: 3 }}>
          <BackButton to="/usermenu" />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", px: 2 }}>
          <Card
            sx={{
              maxWidth: 1000,
              width: "100%",
              borderRadius: 10,
              boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.4)",
              position: "relative",
              // Subtle background pattern for the card content area
              backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")`,
            }}
          >
            {/* PROFILE HEADER WITH BACKGROUND IMAGE */}
            <Box
              sx={{
                height: 320,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                // BACKGROUND IMAGE FOR HEADER
                backgroundImage: `url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay for readability */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
                  backdropFilter: "blur(2px)",
                }}
              />

              {/* Profile Pic with Glow Background */}
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: -15,
                    background: "radial-gradient(circle, rgba(255,87,34,0.4) 0%, rgba(255,87,34,0) 70%)",
                    borderRadius: "50%",
                  }}
                />
                <Avatar
                  src={user.profileImage ? `http://localhost:3001${user.profileImage}` : undefined}
                  sx={{
                    width: 150,
                    height: 150,
                    border: "6px solid #fff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    fontSize: 60,
                    bgcolor: "#ff5722",
                  }}
                >
                  {!user.profileImage && user.username.charAt(0).toUpperCase()}
                </Avatar>

                <input type="file" hidden accept="image/*" id="profile-pic-input" onChange={handleFileChange} />
                <label htmlFor="profile-pic-input">
                  <Tooltip title="Upload New Photo">
                    <IconButton
                      component="span"
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: "#fff",
                        color: "#ff5722",
                        "&:hover": { bgcolor: "#ff5722", color: "#fff" },
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Tooltip>
                </label>
              </Box>

              <Typography
                variant="h4"
                fontWeight="900"
                sx={{ color: "#fff", zIndex: 2, mt: 2, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              >
                {user.username}
              </Typography>

              {selectedFile && (
                <Button
                  variant="contained"
                  onClick={handleUploadProfilePic}
                  disabled={uploading}
                  sx={{
                    mt: 2,
                    zIndex: 2,
                    borderRadius: 5,
                    px: 4,
                    bgcolor: "#ff5722",
                    "&:hover": { bgcolor: "#e64a19" },
                  }}
                >
                  {uploading ? "Uploading..." : "Save New Photo"}
                </Button>
              )}
            </Box>

            <CardContent sx={{ px: { xs: 2, md: 6 }, pb: 6, position: "relative", zIndex: 2, mt: -3 }}>
              <Grid container spacing={4}>
                {/* Account Settings Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 6,
                      bgcolor: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" mb={4} color="#333">
                      🔒 Account Information
                    </Typography>

                    <Stack spacing={4}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">PHONE NUMBER</Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <PhoneIphoneIcon fontSize="small" color="primary" /> {user.phonenumber}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">EMAIL ADDRESS</Typography>
                        {!editingEmail ? (
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" fontWeight="600" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <EmailIcon fontSize="small" color="primary" /> {user.email || "No email provided"}
                            </Typography>
                            <IconButton size="small" onClick={handleEditEmail}><EditIcon fontSize="small" /></IconButton>
                          </Stack>
                        ) : (
                          <Box mt={1}>
                            <TextField
                              fullWidth
                              size="small"
                              value={email}
                              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                              error={!!emailError}
                              helperText={emailError}
                            />
                            <Button size="small" variant="contained" onClick={handleSaveEmail} sx={{ mt: 1, borderRadius: 2 }}>Save</Button>
                          </Box>
                        )}
                      </Box>

                      <Divider />

                      <Stack direction="row" spacing={2}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleOpenEdit}
                          sx={{ bgcolor: "#333", borderRadius: 3, py: 1.2, fontWeight: "bold" }}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleOpenPassword}
                          sx={{ color: "#ff5722", borderColor: "#ff5722", borderRadius: 3, fontWeight: "bold" }}
                        >
                          Security
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Addresses Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 6,
                      bgcolor: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                      <Typography variant="h6" fontWeight="bold" color="#333">🏠 Saved Addresses</Typography>
                      <IconButton onClick={handleOpenAddress} sx={{ bgcolor: "#4f6df3", color: "#fff", "&:hover": { bgcolor: "#e64a19" } }}>
                        <AddIcon />
                      </IconButton>
                    </Stack>

                    <Box sx={{ maxHeight: 280, overflowY: "auto", pr: 1 }}>
                      {(user.addresses ?? []).length === 0 ? (
                        <Typography color="text.secondary" align="center" py={4}>
                          No addresses found.
                        </Typography>
                      ) : (
                        (user.addresses ?? []).map((addr) => (
                          <Paper
                            key={addr.id}
                            elevation={0}
                            sx={{
                              p: 2,
                              mb: 2,
                              borderRadius: 4,
                              border: "1px solid #f0f0f0",
                              bgcolor: "#fafafa",
                              transition: "0.2s",
                              "&:hover": { borderColor: "#ff5722", bgcolor: "#fffbf0" },
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">

                              {/* LEFT SIDE - Address Info */}
                              <Box>
                                <Typography fontWeight="900" color="#ff5722" variant="body2">
                                  {addr.label.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {addr.addressLine}, {addr.city} - {addr.pincode}
                                </Typography>
                              </Box>

                              {/* RIGHT SIDE - Icons */}
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditAddress(addr)}
                                    sx={{
                                      bgcolor: "rgba(255,87,34,0.1)",
                                      color: "#ff5722",
                                      "&:hover": { bgcolor: "#ff5722", color: "#fff" },
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton

                                    size="small"
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    sx={{
                                      bgcolor: "rgba(244,67,54,0.1)",
                                      color: "#f44336",
                                      "&:hover": { bgcolor: "#f44336", color: "#fff" },
                                    }}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>

                            </Stack>
                          </Paper>
                        ))
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* --- RE-USED LOGIC DIALOGS (Styled consistently) --- */}

      {/* Edit Profile */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 6 } }}>
        <DialogTitle sx={{ fontWeight: "900", pt: 3 }}>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField label="Username" fullWidth margin="normal" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
          <TextField label="Phone" fullWidth margin="normal" value={editPhone} onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ""))} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseEdit} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile} sx={{ bgcolor: "#ff5722", borderRadius: 3 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={openPassword} onClose={handleClosePassword} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 6 } }}>
        <DialogTitle sx={{ fontWeight: "900", pt: 3 }}>Change Password</DialogTitle>
        <DialogContent>
          <TextField label="Old Password" type="password" fullWidth margin="normal" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <TextField label="New Password" type="password" fullWidth margin="normal" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <TextField label="Confirm New Password" type="password" fullWidth margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClosePassword} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword} sx={{ bgcolor: "#333", borderRadius: 3 }}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Address Dialog */}
      <Dialog open={openAddress} onClose={handleCloseAddress} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 6 } }}>
        <DialogTitle sx={{ fontWeight: "900", pt: 3 }}> {isEditMode ? "Edit Address" : "New Address"}</DialogTitle>
        <DialogContent>
          <TextField select label="Type" fullWidth margin="normal" value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} SelectProps={{ native: true }}>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </TextField>
          <TextField label="Address Line" fullWidth multiline rows={2} margin="normal" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          <TextField label="City" fullWidth margin="normal" value={city} onChange={(e) => setCity(e.target.value)} />
          <TextField label="Pincode" fullWidth margin="normal" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseAddress} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress} sx={{ bgcolor: "#ff5722", borderRadius: 3 }}>Save Address</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%", borderRadius: 4 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default UserProfile;