import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { CrudService } from "../../services/CrudService";
import { AddFeedback } from "../../services/Model";
import Rating from "@mui/material/Rating";


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

  const crud = CrudService()

  const wordCount = feedback.trim().split(/\s+/).filter(Boolean).length;
  const [rating, setRating] = useState<number | null>(0);


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

    if (image) {
      formData.append("image", image);
    }

    await crud.addFeedback(formData);

    // reset
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
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 10,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.6rem",
          background: "linear-gradient(135deg, #ff5722, #ff9800)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Give Your Feedback
      </DialogTitle>

      <DialogContent>
        <Box mb={2} textAlign="center">
          <Typography variant="subtitle1" color="text.secondary">
            Food
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            🍽 {order?.foodname}
          </Typography>
        </Box>

        <Box mb={3} textAlign="center">
          <Typography mb={1}>Rate your experience</Typography>
          <Rating
            value={rating}
            size="large"
            onChange={(_, value) => setRating(value)}
          />
          <Typography variant="caption" color="text.secondary">
            1 = Poor • 5 = Excellent
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Write your feedback (max 250 words)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        <Typography
          mt={1}
          variant="caption"
          color={wordCount > 250 ? "error" : "text.secondary"}
        >
          {wordCount} / 250 words
        </Typography>
        <Box mt={2}>
          <Typography variant="subtitle2" mb={1}>
            Upload Image (optional)
          </Typography>

          <Button
            variant="outlined"
            component="label"
          >
            Choose Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </Button>
          {image && (
            <Box mt={2}>
              <Typography variant="subtitle2" mb={1}>
                Preview
              </Typography>

              <Box
                component="img"
                src={URL.createObjectURL(image)}
                alt="Feedback preview"
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #ddd",
                }}
              />
            </Box>
          )}

        </Box>

      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ fontWeight: "bold" }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!rating || wordCount === 0 || wordCount > 250}
          onClick={handleSubmit}
          sx={{
            px: 4,
            borderRadius: 3,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #ff5722, #ff9800)",
            ":hover": {
              background: "linear-gradient(135deg, #e64a19, #fb8c00)",
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
