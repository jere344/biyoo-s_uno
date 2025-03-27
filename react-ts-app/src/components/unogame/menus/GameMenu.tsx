import React, { useState } from "react";
import { Box, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useUnoGame } from "@hooks/useUnoGame";

interface GameMenuProps {
  onClose: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onClose }) => {
  const { stopGame } = useUnoGame();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleStopGameClick = () => {
    setShowConfirmation(true);
  };
  
  const handleConfirmStop = () => {
    stopGame();
    setShowConfirmation(false);
  };
  
  const handleCancelStop = () => {
    setShowConfirmation(false);
  };
  
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 100,
      }}
    >
      <Typography variant="h4" color="white" sx={{ mb: 4 }}>
        Game Paused
      </Typography>
      
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 300 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={onClose}
          fullWidth
        >
          Resume Game
        </Button>
        
        <Button 
          variant="outlined" 
          color="error" 
          size="large"
          onClick={handleStopGameClick}
          fullWidth
        >
          Stop Game
        </Button>
      </Stack>
      
      <Dialog
        open={showConfirmation}
        onClose={handleCancelStop}
        aria-labelledby="stop-game-confirmation"
      >
        <DialogTitle id="stop-game-confirmation">Confirm Stop Game</DialogTitle>
        <DialogContent>
          <Typography>
            This will stop the game for all players. Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelStop} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmStop} color="error" variant="contained" autoFocus>
            Stop Game
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GameMenu;
