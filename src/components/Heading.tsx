import React from "react"
import { Box, Typography } from "@mui/material";

export default function Heading() {
  return (
    <Typography variant="h2" fontWeight="700" align="center">
      <Box sx={{ display: "inline", color: "#4BE39C" }}>BEETS WARS</Box>
      {" - "}
      <Box sx={{ display: "inline", color: "#ED1200" }}>ROI Dashboard</Box>
    </Typography>
  )
}
