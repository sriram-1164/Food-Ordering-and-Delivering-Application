import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TablePagination,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EventIcon from '@mui/icons-material/Event';
import { CrudService } from "../../services/CrudService";
import BackButton from "../../components/common/BackButton";

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
  const [page, setPage] = useState(0);
  const rowsPerPage = 6; // Changed to 6 for better Grid symmetry

  const paginatedFeedbacks = feedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const res: any = await crud.getFeedbacksFromNode();
        const data: AdminFeedback[] = Array.isArray(res.data) ? res.data : [];
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFeedbacks(sorted);
      } catch (error) {
        console.error("Error loading feedbacks", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeedbacks();
  }, []);

  const handleViewImage = (imageUrl?: string) => {
    if (!imageUrl) return;
    setSelectedImage(`http://localhost:3001${imageUrl}`);
    setOpenImage(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FBFBFC", // Clean white-grey background
        backgroundImage: `url('https://www.transparenttextures.com/patterns/food.png')`, // Subtle food icons pattern
        pb: 5
      }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ bgcolor: "#fff", py: 3, borderBottom: "1px solid #eee", mb: 4 }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <BackButton to="/adminorders" />
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={900} sx={{ color: "#1a1a1a" }}>
                Customer Voices
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                Real experiences from your hungry customers
              </Typography>
            </Box>
            <Box width={50} /> {/* Spacer for symmetry */}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress sx={{ color: "#ff5722" }} />
          </Box>
        ) : feedbacks.length === 0 ? (
          <Box textAlign="center" py={10}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="textSecondary">No reviews found yet.</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedFeedbacks.map((f) => (
                <Grid size={{xs:12,md:4}}  key={f.id}>
                  <Card sx={{ 
                    height: '100%', 
                    borderRadius: "20px", 
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-5px)" },
                    border: "1px solid #f0f0f0"
                  }}>
                    {f.imageUrl && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={`http://localhost:3001${f.imageUrl}`}
                        alt={f.foodname}
                        onClick={() => handleViewImage(f.imageUrl)}
                        sx={{ cursor: 'pointer', objectFit: 'cover' }}
                      />
                    )}
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ bgcolor: "#ff5722", fontWeight: 'bold', width: 32, height: 32, fontSize: '0.8rem' }}>
                            {f.username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800}>{f.username}</Typography>
                            <Typography variant="caption" color="textSecondary" display="flex" alignItems="center" gap={0.5}>
                              <EventIcon sx={{ fontSize: 12 }} /> {new Date(f.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip label={`#${f.orderId?.slice(-4) || 'N/A'}`} size="medium" sx={{ fontSize: '20px', fontWeight: 700 }} />
                      </Box>

                      <Typography variant="body2" sx={{ 
                        bgcolor: "#fff7ed", 
                        p: 1.5, 
                        borderRadius: "12px", 
                        color: "#444", 
                        fontStyle: 'italic',
                        mb: 2,
                        minHeight: '60px',
                        borderLeft: "4px solid #ff9800"
                      }}>
                        "{f.feedback}"
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <FastfoodIcon sx={{ color: "#ff5722", fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={700}>{f.foodname}</Typography>
                        </Box>
                        <Rating value={f.rating || 0} size="small" readOnly />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="center" mt={5}>
              <Paper sx={{ borderRadius: "50px", px: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                <TablePagination
                  component="div"
                  count={feedbacks.length}
                  page={page}
                  onPageChange={(_, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[6]}
                  labelRowsPerPage=""
                />
              </Paper>
            </Box>
          </>
        )}
      </Container>

      {/* IMAGE DIALOG */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <IconButton onClick={() => setOpenImage(false)} sx={{ position: "absolute", right: 8, top: 8, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}>
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <Box component="img" src={selectedImage} alt="Feedback" sx={{ width: "100%", maxHeight: '80vh', objectFit: "contain" }} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// Simple Divider Helper
const Divider = ({ sx }: any) => <Box sx={{ height: '1px', bgcolor: '#f0f0f0', width: '100%', ...sx }} />;