import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Chip,
  Box,
  Paper,

} from "@mui/material";
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
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Table>

        <TableHead>
          <TableRow
            sx={{
              background: "linear-gradient(135deg, #ff5722, #ff9800)",
            }}
          >
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Food Name
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Price
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Type
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Meal
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {foods.map((food: any) => (
            <TableRow
              key={food.id}
              sx={{
                "&:hover": {
                  backgroundColor: "#fff3e0",
                },
              }}
            >
              <TableCell>{food.foodname}</TableCell>
              <TableCell>₹{food.price}</TableCell>
              <TableCell>
                <Chip
                  label={food.foodtype}
                  size="small"
                  color={
                    food.foodtype === "Veg" ? "success" : "error"
                  }
                />
              </TableCell>

              <TableCell>{food.mealtype}</TableCell>
              <TableCell>
                {user && (
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => onOrder(food)}
                  >
                    Order
                  </Button>
                )}

                {admin && (
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => onEdit(food)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => onDelete(food.id)}
                    >
                      Delete
                    </Button>
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
