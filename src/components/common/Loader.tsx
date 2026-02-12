import { Box } from "@mui/material";
import { PacmanLoader } from "react-spinners";
const Loader = () => (
  <Box  className= "Loader">
    <PacmanLoader
      color="#ff1b1b"
      size={23}
      speedMultiplier={2}
    />
  </Box>
);
export default Loader;
