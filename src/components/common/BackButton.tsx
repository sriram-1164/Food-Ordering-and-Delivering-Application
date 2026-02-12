import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const BackButton = ({ to }: { to: string }) => {
  const navigate = useNavigate();
  return (
    <Button 
     variant="contained"
                    sx={{
          px: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ff5722, #ff9800)",
          ":hover": {
            background: "linear-gradient(135deg, #e64a19, #fb8c00)",
          },
        }}
        onClick={() => navigate(to)}>
      ← Back
    </Button>
  );
};
export default BackButton;
