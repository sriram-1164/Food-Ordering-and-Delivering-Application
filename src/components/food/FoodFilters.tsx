import {
  Box,
  TextField,
  Chip,
  Typography,
  Stack,
  Autocomplete,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

// If you have more meal types in backend, keep this list in sync
const meals = ["Breakfast", "Lunch", "Dinner", "Snacks", "Juice", "Desert"];

interface FoodFiltersProps {
  foods: Array<{
    foodId: number;
    foodname: string;
    foodtype: string;
    mealtypes: string[];
    // ... other fields you might have
  }>;
  onFilter: (filteredFoods: any[]) => void;
}

export default function FoodFilters({ foods = [], onFilter }: FoodFiltersProps) {
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState<"Veg" | "Non-Veg" | "">(""); // "" = no filter
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  useEffect(() => {
    const filtered = foods.filter((food) => {
      // Search by name (case insensitive)
      const nameMatch = !search.trim() ||
        food.foodname.toLowerCase().includes(search.trim().toLowerCase());

      // Food type filter (Veg / Non-Veg)
      const typeMatch = !foodType ||
        food.foodtype.toLowerCase() === foodType.toLowerCase();

      // Meal type filter – check if selected meal is IN the array
      const mealMatch = !selectedMeal ||
        food.mealtypes?.some((m) =>
          m.toLowerCase() === selectedMeal.toLowerCase()
        );

      return nameMatch && typeMatch && mealMatch;
    });

    onFilter(filtered);
  }, [search, foodType, selectedMeal, foods, onFilter]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 5,
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems="center"
      >
        {/* Search */}
        <TextField
          placeholder="Search for dishes..."
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ),
            sx: { borderRadius: 4, bgcolor: "#f8fafc" },
          }}
        />

        {/* Veg / Non-Veg chips */}
        <Stack direction="row" spacing={1.5}>
          {["Veg", "Non-Veg"].map((t) => (
            <Chip
              key={t}
              label={t}
              clickable
              onClick={() => setFoodType(foodType === t ? "" : (t as "Veg" | "Non-Veg"))}
              color={foodType === t ? "primary" : "default"}
              variant={foodType === t ? "filled" : "outlined"}
              sx={{ fontWeight: 600, px: 2, minWidth: 90 }}
            />
          ))}
        </Stack>

        {/* Meal Type Dropdown */}
        <Autocomplete
          options={meals}
          value={selectedMeal}
          onChange={(_, value) => setSelectedMeal(value)}
          sx={{ minWidth: 220 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Meal Type"
              variant="outlined"
              placeholder="Any"
              sx={{ "& fieldset": { borderRadius: 4 } }}
            />
          )}
        />
      </Stack>
    </Paper>
  );
}