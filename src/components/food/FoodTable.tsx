import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, TableContainer, Chip, Box, Paper, Typography, IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect, useState } from "react";
import { FoodDetails } from "../../services/Model";

export default function FoodTable({
  foods = [],
  user,
  admin,
  onOrder,
  onDelete,
  onEdit,
}: any) {
  const [allFoods, setAllFoods] = useState<FoodDetails[]>()
  useEffect(() => {
    setAllFoods(foods)
  }, [foods])

 return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eef2f6', overflow: 'hidden' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>ITEM DETAILS</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>PRICE</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>CATEGORY</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#64748b', textAlign: 'right' }}>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foods.map((food: any) => (
            <TableRow key={food.foodId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <Box>
                  <Typography variant="body1" fontWeight={700} color="#1e293b">{food.foodname}</Typography>
                  <Typography variant="caption" color="textSecondary">{food.mealtype}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography fontWeight={800} color="#10b981">₹{food.price}</Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={food.foodtype} 
                  size="small" 
                  sx={{ 
                    fontWeight: 700,
                    bgcolor: food.foodtype === "Veg" ? "#ecfdf5" : "#fef2f2",
                    color: food.foodtype === "Veg" ? "#10b981" : "#ef4444",
                    border: `1px solid ${food.foodtype === "Veg" ? "#10b981" : "#ef4444"}`
                  }} 
                />
              </TableCell>
              <TableCell align="right">
                {user && (
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => onOrder(food)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, bgcolor: '#FF5200', '&:hover': { bgcolor: '#e64a19' } }}
                  >
                    Order Now
                  </Button>
                )}
                {admin && (
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton size="small" onClick={() => onEdit(food)} sx={{ color: '#10b981', bgcolor: '#f0fdf4' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(food.foodId)} sx={{ color: '#ef4444', bgcolor: '#fef2f2' }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}