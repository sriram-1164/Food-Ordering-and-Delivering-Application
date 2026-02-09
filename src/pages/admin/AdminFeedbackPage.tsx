import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";
import { CrudService } from "../../services/CrudService";
import BackButton from "../../components/common/BackButton";

/* =======================
   TYPE
======================= */
interface AdminFeedback {
  id: string;
  orderId?: string;
  userId: string;
  foodId: string;
  username?: string;
  foodname?: string;
  feedback: string;
  rating: number;
  createdAt: string;
  imageUrl?: string;
}

export default function AdminFeedbackPage() {
  const crud = CrudService();

  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  // image dialog
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* =======================
     LOAD FEEDBACK FROM NODE
  ======================= */
  useEffect(() => {
    crud.getFeedbacksFromNode().then((res: any) => {
      setFeedbacks(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    });
  }, []);

  const handleViewImage = (imageUrl?: string) => {
    if (!imageUrl) return;
    setSelectedImage(`http://localhost:3002${imageUrl}`);
    setOpenImage(true);
  };

  return (
    <Box
      p={3}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff7ed, #ffe0d1)",
      }}
    >
      {/* BACK BUTTON */}
      <Box mb={2}>
        <BackButton to="/adminorders" />
      </Box>

      {/* TITLE */}
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        mb={3}
        sx={{
          background: "linear-gradient(135deg, #ff5722, #ff9800)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        User Feedback
      </Typography>

      {/* TABLE CARD */}
      <Paper
        sx={{
          maxWidth: 1200,
          mx: "auto",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table>
          {/* HEADER */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#ff9800" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Order Id
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                User
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Food
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Feedback
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Rating
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Image
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Date
              </TableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    Loading feedback...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : feedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">
                    📝 No feedback available yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map((f) => (
                <TableRow
                  key={f.id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "#fff3e0" } }}
                >
                  <TableCell>{f.orderId ?? "—"}</TableCell>

                  <TableCell>{f.username ?? "—"}</TableCell>

                  <TableCell>
                    <Typography fontWeight="bold">
                      {f.foodname ?? "—"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 350 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {f.feedback}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Rating value={f.rating || 0} readOnly />
                  </TableCell>

                  {/* IMAGE BUTTON */}
                  <TableCell>
                    {f.imageUrl ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewImage(f.imageUrl)}
                      >
                        View Image
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(f.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* IMAGE VIEW DIALOG */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="sm">
        <IconButton
          onClick={() => setOpenImage(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 2 }}>
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Feedback"
              sx={{
                width: "100%",
                maxHeight: 500,
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
