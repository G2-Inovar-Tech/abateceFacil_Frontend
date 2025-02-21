import React from "react";
import { CircularProgress, Box } from "@mui/material";

export default function SmallLoader({ size = 24 }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress size={size} color="inherit" />
    </Box>
  );
}
