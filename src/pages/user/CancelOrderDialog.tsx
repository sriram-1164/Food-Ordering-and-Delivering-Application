import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function CancelOrderDialog({
  open,
  onClose,
  onConfirm,
}: any) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 5,
          p: 1,
          maxWidth: "400px",
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', pt: 4 }}>
        {/* Warning Icon Header */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar sx={{ bgcolor: '#fff1f0', width: 70, height: 70 }}>
            <WarningAmberRoundedIcon sx={{ fontSize: 40, color: '#f5222d' }} />
          </Avatar>
        </Box>

        <Typography variant="h5" fontWeight="900" color="#1a1a1a" gutterBottom>
          Cancel Order?
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ px: 2 }}>
          Are you sure you want to cancel this order? This action 
          <strong> cannot be undone</strong> and you might lose your spot in the kitchen queue.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 4, px: 3, gap: 1 }}>
        <Button 
          onClick={onClose}
          fullWidth
          sx={{ 
            borderRadius: 3, 
            py: 1.2, 
            fontWeight: 'bold', 
            color: '#595959',
            textTransform: 'none',
            border: '1px solid #d9d9d9'
          }}
        >
          No, Keep Order
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={onConfirm}
          sx={{ 
            borderRadius: 3, 
            py: 1.2, 
            fontWeight: 'bold', 
            textTransform: 'none',
            background: "linear-gradient(135deg, #f5222d, #cf1322)",
            boxShadow: "0 4px 14px rgba(245, 34, 45, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #cf1322, #a8071a)",
            }
          }}
        >
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}