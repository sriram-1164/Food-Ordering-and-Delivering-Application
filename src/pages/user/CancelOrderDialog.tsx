import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function CancelOrderDialog({
  open,
  onClose,
  onConfirm,
}: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cancel Order</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to cancel this order?
          <br />
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
        >
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
