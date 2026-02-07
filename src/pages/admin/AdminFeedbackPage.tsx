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
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { CrudService } from "../../services/CrudService";
import BackButton from "../../components/common/BackButton";

/* =======================
   TYPE DEFINITION
======================= */
interface AdminFeedback {
  id: string;
  userId: string;
  foodId: string;
  username?: string;
  foodname?: string;
  feedback: string;
  rating: number;
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const crud = CrudService();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     LOAD FEEDBACK
  ======================= */
  useEffect(() => {
    crud.getFeedback().then((res: any[]) => {
      setFeedbacks(Array.isArray(res) ? res : []);
      setLoading(false);
    });
  }, []);

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
          maxWidth: 1100,
          mx: "auto",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table>
          {/* TABLE HEADER */}
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
                Date
              </TableCell>
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="text.secondary">
                    Loading feedback...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : feedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
                  sx={{
                    "&:hover": { backgroundColor: "#fff3e0" },
                  }}
                >
                  <TableCell>
                    {f.orderId ?? "—"}
                  </TableCell>
                  {/* USER */}
                  <TableCell>
                    {f.username ?? "—"}
                  </TableCell>

                  {/* FOOD */}
                  <TableCell>
                    <Typography fontWeight="bold">
                      {f.foodname ?? "—"}
                    </Typography>
                  </TableCell>

                  {/* FEEDBACK */}
                  <TableCell sx={{ maxWidth: 350 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {f.feedback}
                    </Typography>
                  </TableCell>

                  {/* RATING */}
                  <TableCell>
                    <Rating value={f.rating || 0} readOnly />
                  </TableCell>

                  {/* DATE */}
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
    </Box>
  );
}
