import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import { FoodDetails } from "../../services/Model";

export default function FoodCards({
  foods = [],
  user,
  admin,
  onOrder,
  onDelete,
  onEdit,
}: any) {
  const [allFoods, setAllFoods] = useState<FoodDetails[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDetails | null>(null);

  useEffect(() => {
    setAllFoods(foods);
  }, [foods]);

  const handleCardClick = (food: FoodDetails) => {
    setSelectedFood(food);
  };

  const handleClose = () => {
    setSelectedFood(null);
  };

  const defaultImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
      {allFoods.map((food: FoodDetails) => (
        <Card
          key={food.foodId}
          onClick={() => handleCardClick(food)}
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            },
            cursor: "pointer",
            position: "relative",
          }}
        >
          {/* Swiggy-style Image */}
          <CardMedia
            component="img"
            height="220"
            image={food.photoUrl ? `http://localhost:3001${food.photoUrl}` : defaultImage}
            alt={food.foodname}
            sx={{ objectFit: "cover" }}
          />

          {/* Veg/Non-Veg Badge */}
          <Chip
            label={food.foodtype}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 700,
              bgcolor: food.foodtype === "Veg" ? "#ecfdf5" : "#fef2f2",
              color: food.foodtype === "Veg" ? "#10b981" : "#ef4444",
              border: `2px solid ${food.foodtype === "Veg" ? "#10b981" : "#ef4444"}`,
            }}
          />

          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={700} color="#1e293b" gutterBottom>
              {food.foodname}
            </Typography>

            <Typography variant="body2" color="textSecondary" mb={1}>
              {food.mealtypes}
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight={800} fontSize="1.4rem" color="#10b981">
                ₹{food.price}
              </Typography>

              {user && (
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOrder(food);
                  }}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#FF5200",
                    "&:hover": { bgcolor: "#e64a19" },
                    px: 3,
                  }}
                >
                  Order
                </Button>
              )}

              {admin && (
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(food);
                    }}
                    sx={{ color: "#10b981", bgcolor: "#f0fdf4" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(food.foodId);
                    }}
                    sx={{ color: "#ef4444", bgcolor: "#fef2f2" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}

     {/* Food Details Modal – Improved Design */}
<Dialog 
  open={!!selectedFood} 
  onClose={handleClose} 
  maxWidth="xs" 
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
    }
  }}
>
  {selectedFood && (
    <>
      {/* Header with gradient accent */}
      <DialogTitle 
        sx={{ 
          p: 0,
          position: 'relative',
          bgcolor: 'linear-gradient(135deg, #FF5200 0%, #FF8A00 100%)',
          color: 'white',
          py: 3,
          px: 4,
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight={700}
          color="error"
          sx={{ 
            color: selectedFood.foodtype === 'Veg' ? '#2e7d32' : '#c62828',
          }}
        >
          {selectedFood.foodname}
        </Typography>

        {/* Small badge on top-right */}
        <Chip
          label={selectedFood.foodtype}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'white',
            color: selectedFood.foodtype === 'Veg' ? '#2e7d32' : '#c62828',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 4, pb: 3 }}>
        {/* Image – larger, rounded, with subtle shadow */}
        <Box 
          sx={{ 
            mb: 4, 
            overflow: 'hidden', 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.02)' },
          }}
        >
          <img
            src={
              selectedFood.photoUrl
                ? `http://localhost:3001${selectedFood.photoUrl}`
                : defaultImage
            }
            alt={selectedFood.foodname}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
              aspectRatio: '4 / 3',
            }}
          />
        </Box>

        {/* Info section – clean grid layout */}
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          {/* Meal Types – shown as chips */}
          <Box>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Available for
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedFood.mealtypes?.length > 0 ? (
                selectedFood.mealtypes.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    size="medium"
                    sx={{
                      bgcolor: '#fff3e0',
                      color: '#ef6c00',
                      fontWeight: 600,
                      border: '1px solid #ff9800',
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Not specified
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Food Type */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, minWidth: 100 }}>
              Food Type
            </Typography>
            <Chip
              label={selectedFood.foodtype}
              color={selectedFood.foodtype === 'Veg' ? 'success' : 'error'}
              variant="outlined"
              sx={{ fontWeight: 600, minWidth: 100 }}
            />
          </Box>

          {/* Price – prominent */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, minWidth: 100 }}>
              Price
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={800} 
              color="#10b981"
              sx={{ 
                background: 'linear-gradient(90deg, #e8f5e9, #c8e6c9)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                display: 'inline-block'
              }}
            >
              ₹{selectedFood.price}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="contained" 
          fullWidth
          size="large"
          sx={{ 
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #FF5200, #FF8A00)',
            fontWeight: 700,
            fontSize: '1.1rem',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(255,82,0,0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e64a19, #f57c00)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(255,82,0,0.4)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </>
  )}
</Dialog>
    </Box>
  );
}