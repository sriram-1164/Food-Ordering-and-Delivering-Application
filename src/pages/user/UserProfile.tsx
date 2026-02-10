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
            disabled
          >
            Edit Profile (Coming Soon)
          </Button>

          <Button
            fullWidth
            startIcon={<LockIcon />}
            variant="outlined"
            disabled
          >
            Change Password (Coming Soon)
          </Button>
        </Stack>

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
