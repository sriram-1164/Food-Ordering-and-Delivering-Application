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
    const crud = CrudService()

    const wordCount = feedback.trim().split(/\s+/).filter(Boolean).length;
    const [rating, setRating] = useState<number | null>(0);


    const handleSubmit = async () => {
        if (!order) return;

        const payload: AddFeedback = {
          orderId: order.id,
          userId: order.userId,
          username: order.username,
          foodname: order.foodname,
          feedback: feedback.trim(),
          createdAt: new Date().toISOString(),
          rating: rating || 0,
          foodId: ""
        };

        await crud.addFeedback(payload);
        setFeedback("");
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
