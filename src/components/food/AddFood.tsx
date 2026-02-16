import {
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../services/CrudService";
import { AddFoodDetails, FoodDetails } from "../../services/Model";
const meals = ["Breakfast", "Lunch", "Dinner", "Snacks","Juice","Desert"];
export default function AddFood({
  editFood,
  onSave,
}: {
  editFood?: FoodDetails | null;
  onSave: () => void;
}) {
  const crud = CrudService();
  const [foodname, setFoodName] = useState("");
  const [price, setPrice] = useState<any>();
  const [foodtype, setFoodType] = useState<"Veg" | "Non-Veg">("Veg");
  const [mealtype, setMealType] = useState("");
  const [foods, setFoods] = useState<AddFoodDetails[]>();
  const getAllFoods = async () => {
    const responce= await crud.getFoods()
    setFoods(responce)
    }
    const timestamp = Date.now();
  const handleSubmit = async () => {
    const payload: AddFoodDetails = {
      foodId:timestamp,
      foodname,
      price,
      mealtype,
      foodtype,
    };
    if (editFood) {
      await crud.updateFood(editFood.foodId, payload);
      getAllFoods()
    } else {
      await crud.addFoods(payload);
      getAllFoods()
    }
    onSave(); //  refresh parent list
  };
  
  useEffect(() => {
    if (editFood) {
      setFoodName(editFood.foodname);
      setPrice(editFood.price);
      setFoodType(editFood.foodtype as "Veg" | "Non-Veg");
      setMealType(editFood.mealtype);
    }
    getAllFoods();
  }, [editFood]);

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 1,
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        sx={{ color: "#ff5722" }}
      >
        {editFood ? "Edit Food Item" : "Add New Item"}
      </Typography>
      <TextField
        label="Food Name"
        fullWidth
        margin="normal"
        value={foodname}
        onChange={(e) => setFoodName(e.target.value)}
      />
      <TextField
        label="Price (₹)"
        type="number"
        fullWidth
        margin="normal"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <Autocomplete
        options={meals}
        value={mealtype}
        onChange={(_, value) => setMealType(value || "")}
        renderInput={(params) => (
          <TextField {...params} label="Meal Type" margin="normal" />
        )}
        sx={{ mt: 1 }}
      />
      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight="bold"  sx={{ color: "#ff5722" }}>
          Food Type
        </Typography>
        <RadioGroup
          row
          value={foodtype}
          onChange={(e) =>
            setFoodType(e.target.value as "Veg" | "Non-Veg")
          }
        >
          <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
          <FormControlLabel
            value="Non-Veg"
            control={<Radio />}
            label="Non-Veg"
          />
        </RadioGroup>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          sx={{
            px: 4,
            borderRadius: 2,
            background: "linear-gradient(135deg, #ff5722, #ff9800)",
            ":hover": {
              background: "linear-gradient(135deg, #e64a19, #fb8c00)",
            },
          }}
          onClick={handleSubmit}
        >
          {editFood ? "Update Food" : "Add Food"}
        </Button>
      </Box>
    </Box>
  );
}