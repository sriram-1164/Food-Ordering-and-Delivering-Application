import { Box, TextField, Chip, Typography, Stack, Autocomplete, InputAdornment, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
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
    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
        <TextField
          placeholder="Search for dishes..."
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon color="disabled" /></InputAdornment>),
            sx: { borderRadius: 4, bgcolor: '#f8fafc' }
          }}
        />
        
   <Stack direction="row" spacing={1}>
  {["Veg", "Non-Veg"].map((t) => (
    <Chip
      key={t}
      label={t}
      clickable
      onClick={() => setType(type === t ? "" : t)}
      color={type === t ? "primary" : "default"}
      // CHANGE "contained" TO "filled" HERE:
      variant={type === t ? "filled" : "outlined"} 
      sx={{ fontWeight: 700, px: 2 }}
    />
  ))}
</Stack>

        <Autocomplete
          options={meals}
          value={meal}
          onChange={(_, value) => setMeal(value)}
          sx={{ minWidth: 200 }}
          renderInput={(params) => <TextField {...params} label="Meal Type" variant="outlined" sx={{ '& fieldset': { borderRadius: 4 } }} />}
        />
      </Stack>
    </Paper>
  );
}