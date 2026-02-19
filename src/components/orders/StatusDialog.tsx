import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function StatusDialog({ open, onClose, onSubmit }: any) {
  const [status, setStatus] = useState("Preparing");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
    >

      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #ff5722, #ff9800)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Update Order Status
      </DialogTitle>

      <DialogContent>

        <Box mt={1}>
          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            Select Status
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={status === "Preparing"}
                onChange={() => setStatus("Preparing")}
                color="warning"
              />
            }
            label="Preparing"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={status === "OutforDelivery"}
                onChange={() => setStatus("OutforDelivery")}
                color="info"
              />
            }
            label="Out for Delivery"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={status === "Delivered"}
                onChange={() => setStatus("Delivered")}
                color="success"
              />
            }
            label="Delivered"
          />
        </Box>


        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          mt={3}
        >
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              px: 3,
              background: "linear-gradient(135deg, #ff5722, #ff9800)",
              ":hover": {
                background:
                  "linear-gradient(135deg, #e64a19, #fb8c00)",
              },
            }}
            onClick={() => onSubmit(status)}
          >
            Update
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}