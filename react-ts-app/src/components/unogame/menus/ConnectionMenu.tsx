import React from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useUnoGame } from "@hooks/useUnoGame";

const ConnectionMenu: React.FC = () => {
  const { connectionStatus, error } = useUnoGame();

  if (connectionStatus === "connecting") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 100,
        }}
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h5" color="white" sx={{ mt: 2 }}>
          Connecting to game...
        </Typography>
      </Box>
    );
  }

  if (connectionStatus === "disconnected") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 100,
        }}
      >
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Disconnected from game
        </Typography>
        {error && (
          <Typography variant="body1" color="white" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Reconnect
        </Button>
      </Box>
    );
  }

  return null;
};

export default ConnectionMenu;
