import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to: string;
  label?: string;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "success" | "info" | "warning";
  gradient?: string; // custom gradient override
}

const BackButton = ({
  to,
  label = "← Back",
  variant = "contained",
  color = "primary",
  gradient,
}: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant={variant}
      color={!gradient ? color : undefined}
      sx={{
        px: 4,
        borderRadius: 3,
        fontWeight: "bold",
        ...(gradient && {
          background: gradient,
          color: "#fff",
          "&:hover": {
            opacity: 0.9,
          },
        }),
      }}
      onClick={() => navigate(to)}
    >
      {label}
    </Button>
  );
};

export default BackButton;
