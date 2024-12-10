import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ImagemPadrao from "../assets/backgroundHome.png";

export default function Login() {
  const navigate = useNavigate();

  const handleAccess = () => {
    navigate("/home"); // Navega para a página Home
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: "block", width: "50%" }}>
          <img src={ImagemPadrao} alt="Imagem inicial" width="100%" />
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography>Hello Word!</Typography>
          <Button variant="contained" onClick={handleAccess}>
            Acessar
          </Button>
        </Box>
      </Box>
    </>
  );
}
