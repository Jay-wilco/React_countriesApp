"use client";

import React from "react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button, Zoom } from "@mui/material";

export default function BackToTopButton() {
  const isVisible = useScrollPosition(300); // threshold

  // 🔹 do not render anything if not visible
  if (!isVisible) return null;

  return (
    <Zoom in={isVisible}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          borderRadius: "50%",
          minWidth: 56,
          minHeight: 56,
          zIndex: 1200,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          "&:hover": { transform: "translateY(-3px)" },
        }}
      >
        <ArrowUpwardIcon />
      </Button>
    </Zoom>
  );
}
