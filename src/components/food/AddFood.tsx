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

const meals = ["Breakfast", "Lunch", "Dinner", "Snacks", "Juice", "Desert"];

export default function AddFood({
  editFood,
  onSave,
}: {
  editFood?: FoodDetails | null;
  onSave: () => void;
}) {
  const crud = CrudService();

  const [foodname, setFoodName] = useState("");
  const [price, setPrice] = useState<string>(""); // changed to string for cleaner input
  const [foodtype, setFoodType] = useState<"Veg" | "Non-Veg">("Veg");
  const [mealtypes, setMealTypes] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    foodname: "",
    price: "",
    mealtypes: "",
  });

  const validateForm = () => {
    const newErrors = {
      foodname: "",
      price: "",
      mealtypes: "",
    };

    let isValid = true;

    if (!foodname.trim()) {
      newErrors.foodname = "Food name is required";
      isValid = false;
    }

    const priceNum = Number(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Enter a valid price greater than 0";
      isValid = false;
    }

    if (mealtypes.length === 0) {
      newErrors.mealtypes = "Select at least one meal type";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload: AddFoodDetails = {
      foodId: editFood ? editFood.foodId : Date.now(),
      foodname: foodname.trim(),
      price: Number(price),
      mealtypes,
      foodtype,
    };

    try {
      if (editFood) {
        await crud.updateFood(editFood.foodId, payload, photo ?? undefined);
      } else {
        await crud.addFoods(payload, photo ?? undefined);
      }

      onSave(); // tell parent to refresh list

      // Reset form only when adding new item (not editing)
      if (!editFood) {
        setFoodName("");
        setPrice("");
        setFoodType("Veg");
        setMealTypes([]);
        setPhoto(null);
        setPhotoPreview(null);
      }

      // Optional: clear errors after success
      setErrors({ foodname: "", price: "", mealtypes: "" });
    } catch (err) {
      console.error("Error saving food:", err);
      // You can show toast/notification here later
    }
  };

  useEffect(() => {
    if (editFood) {
      setFoodName(editFood.foodname || "");
      setPrice(editFood.price?.toString() || "");
      setFoodType((editFood.foodtype as "Veg" | "Non-Veg") || "Veg");
      setMealTypes(editFood.mealtypes || []);
      if (editFood.photoUrl) {
        setPhotoPreview(`http://localhost:3001${editFood.photoUrl}`);
      } else {
        setPhotoPreview(null);
      }
    }
    // No need to reset form when switching between add/edit — controlled by editFood prop
  }, [editFood]);

  return (
    <Box sx={{ backgroundColor: "#fff", borderRadius: 3, boxShadow: 2, p: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="#FF5200" mb={3}>
        {editFood ? "Edit Food Item" : "Add New Food Item"}
      </Typography>

      <TextField
        label="Food Name"
        fullWidth
        margin="normal"
        value={foodname}
        error={!!errors.foodname}
        helperText={errors.foodname}
        onChange={(e) => setFoodName(e.target.value)}
      />

      <TextField
        label="Price (₹)"
        type="number"
        fullWidth
        margin="normal"
        value={price}
        error={!!errors.price}
        helperText={errors.price}
        onChange={(e) => setPrice(e.target.value)}
        inputProps={{ min: "1", step: "1" }}
      />

      <Autocomplete
        multiple
        options={meals}
        value={mealtypes}
        onChange={(_, newValue) => setMealTypes(newValue as string[])}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Meal Types (select multiple)"
            margin="normal"
            placeholder="Breakfast, Lunch, Snacks..."
            error={!!errors.mealtypes}
            helperText={errors.mealtypes}
          />
        )}
      />

      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight="bold" color="#FF5200" mb={1}>
          Food Type
        </Typography>
        <RadioGroup
          row
          value={foodtype}
          onChange={(e) => setFoodType(e.target.value as "Veg" | "Non-Veg")}
        >
          <FormControlLabel value="Veg" control={<Radio />} label="Veg" />
          <FormControlLabel value="Non-Veg" control={<Radio />} label="Non-Veg" />
        </RadioGroup>
      </Box>

      {/* Photo Upload */}
      <Box mt={4}>
        <Typography variant="subtitle1" fontWeight="bold" color="#FF5200" mb={1}>
          Food Photo
        </Typography>
        <Box
          onClick={() => document.getElementById("photo-upload")?.click()}
          sx={{
            border: "3px dashed #ddd",
            borderRadius: 3,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
            transition: "all 0.2s",
            "&:hover": { borderColor: "#FF5200", backgroundColor: "#fffaf0" },
          }}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box textAlign="center" p={3}>
              <Typography color="textSecondary" variant="body1">
                Click to upload food photo
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Recommended size: 800 × 600 px or larger
              </Typography>
            </Box>
          )}
        </Box>

        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          hidden
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={5}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 3,
            background: "linear-gradient(135deg, #FF5200, #FF8A00)",
            fontWeight: 700,
            fontSize: "1.1rem",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #e64a19, #f57c00)",
            },
          }}
        >
          {editFood ? "Update Food Item" : "Add Food Item"}
        </Button>
      </Box>
    </Box>
  );
}