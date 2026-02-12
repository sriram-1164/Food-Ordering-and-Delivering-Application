import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
const meals = ["Breakfast", "Lunch", "Dinner", "Snacks"];
export default function FoodFilters({ foods = [], onFilter }: any) {
  const safeFoods = Array.isArray(foods) ? foods : [];
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [meal, setMeal] = useState<string | null>(null);

  useEffect(() => {
    const filtered = safeFoods.filter((f: any) => {
      const nameMatch =
        !search ||
        f.name?.toLowerCase().includes(search.toLowerCase());

      const typeMatch =
        !type ||
        f.foodtype?.toLowerCase() === type.toLowerCase();

      const mealMatch =
        !meal ||
        f.mealtype?.toLowerCase() === meal.toLowerCase();

      return nameMatch && typeMatch && mealMatch;
    });

    onFilter(filtered);
  }, [search, type, meal, safeFoods, onFilter]);

  return (
    <Box
      mb={2}
      p={2}
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        mb={2}
        sx={{ color: "#ff5722" }}
      >
        Filter Food Items
      </Typography>
      <Box
        display="flex"
        gap={2}
        flexWrap="wrap"
        alignItems="center"
      >
        <TextField
          label="Search Here"
          value={search}   
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />
        <Box>
          <Typography variant="caption" fontWeight="bold">
            Food Type
          </Typography>
          <RadioGroup
            row
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <FormControlLabel
              value="Veg"
              control={<Radio />}
              label="Veg"
            />
            <FormControlLabel
              value="Non-Veg"
              control={<Radio />}
              label="Non-Veg"
            />
          </RadioGroup>
        </Box>
        <Autocomplete
          options={meals}
          value={meal}
          onChange={(_, value) => setMeal(value)}
          sx={{ minWidth: 200 }}
          renderInput={(params) => (
            <TextField {...params} label="Meal Type" />
          )}
        />
      </Box>
    </Box>
  );
}