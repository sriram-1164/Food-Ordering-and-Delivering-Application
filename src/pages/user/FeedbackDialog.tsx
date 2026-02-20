import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  Rating,
  Avatar,
  Stack,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { CrudService } from "../../services/CrudService";
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

interface Order {
  username: string;
  id: string;
  userId: string;
  foodId: string;
  foodname: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function FeedbackDialog({ open, onClose, order }: Props) {
  const [feedback, setFeedback] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [rating, setRating] = useState<number | null>(0);
  
  const crud = CrudService();
  const wordCount = feedback.trim().split(/\s+/).filter(Boolean).length;

  // Dynamic feedback labels based on rating
  const getRatingLabel = (val: number | null) => {
    if (!val) return "Select a rating";
    if (val <= 1) return "Disappointing 😞";
    if (val <= 2) return "Bad 😐";
    if (val <= 3) return "Okayish 🙂";
    if (val <= 4) return "Very Good! 😋";
    return "Outstanding! 😍";
  };

  const handleSubmit = async () => {
    if (!order) return;
    const formData = new FormData();
    formData.append("orderId", order.id);
    formData.append("userId", order.userId);
    formData.append("username", order.username);
    formData.append("foodname", order.foodname);
    formData.append("feedback", feedback.trim());
    formData.append("createdAt", new Date().toISOString());
    formData.append("rating", String(rating || 0));
    formData.append("foodId", order.foodId);
    if (image) formData.append("image", image);

    await crud.addFeedback(formData);
    setFeedback("");
    setRating(0);
    setImage(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 5, p: 1, position: 'relative' },
      }}
    >
      <IconButton 
        onClick={onClose} 
        sx={{ position: 'absolute', right: 16, top: 16, color: 'text.secondary' }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle sx={{ textAlign: "center", pt: 4, pb: 1 }}>
        <Typography variant="h5" fontWeight={900} letterSpacing={-0.5}>
          Rate Your Meal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          How was the <b>{order?.foodname}</b>?
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} alignItems="center">
          {/* RATING SECTION */}
          <Box textAlign="center" sx={{ mt: 1 }}>
            <Typography variant="h6" sx={{ color: '#FF5200', fontWeight: 800, mb: 1 }}>
              {getRatingLabel(rating)}
            </Typography>
            <Rating
              value={rating}
              size="large"
              precision={1}
              onChange={(_, value) => setRating(value)}
              sx={{ 
                fontSize: '3rem',
                '& .MuiRating-iconFilled': { color: '#FF5200' },
                '& .MuiRating-iconHover': { color: '#FF5200' }
              }}
            />
          </Box>

          {/* TEXT FEEDBACK */}
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="filled"
            placeholder="Tell us what you loved or what could be better..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            InputProps={{ 
                disableUnderline: true,
                sx: { borderRadius: 3, p: 2, bgcolor: '#f8fafc' } 
            }}
          />

          <Box width="100%" display="flex" justifyContent="space-between">
            <Typography variant="caption" color={wordCount > 250 ? "error" : "text.secondary"} fontWeight={700}>
               {wordCount} / 250 words
            </Typography>
          </Box>

          {/* IMAGE UPLOAD SECTION */}
          <Box width="100%">
             {!image ? (
               <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<PhotoCameraIcon />}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 3, 
                  borderStyle: 'dashed', 
                  color: 'text.secondary',
                  borderColor: '#cbd5e1',
                  textTransform: 'none',
                  '&:hover': { borderStyle: 'dashed', bgcolor: '#f1f5f9' }
                }}
              >
                Add a photo of your food
                <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && setImage(e.target.files[0])} />
              </Button>
             ) : (
               <Paper variant="outlined" sx={{ p: 1, borderRadius: 3, position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={URL.createObjectURL(image)} 
                    variant="rounded" 
                    sx={{ width: 60, height: 60, borderRadius: 2 }} 
                  />
                  <Box flex={1}>
                    <Typography variant="caption" fontWeight={700} display="block">Photo added!</Typography>
                    <Typography variant="caption" color="text.secondary">This helps others order.</Typography>
                  </Box>
                  <IconButton color="error" size="small" onClick={() => setImage(null)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
               </Paper>
             )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          fullWidth
          variant="contained"
          disabled={!rating || wordCount === 0 || wordCount > 250}
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            textTransform: 'none',
            fontSize: '1rem',
            background: "linear-gradient(135deg, #1a1a1a, #333)",
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            '&:hover': { background: "#000" },
            '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
          }}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}