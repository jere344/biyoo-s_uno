import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Typography,
  Box,
  Button,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar
} from "@mui/material";
import Game3DScene from "./Game3DScene";
import IUnoGame from "../../../data_interfaces/IUnoGame";
import IUnoPlayer from "../../../data_interfaces/IUnoPlayer";

export interface UnoGameBoard3dProps {
    gameState: IUnoGame;
    myPlayer: IUnoPlayer | null;
    currentPlayer: IUnoPlayer | null;
    isMyTurn: boolean;
    myUserName: string;
    roomId: number;
    connectionStatus: "connected" | "disconnected" | "connecting";
    onPlayCard: (cardId: number) => void;
    onDrawCard: () => void;
    onRestartGame: () => void;
    onStopGame: () => void;
  }

  
const UnoGameBoard3d: React.FC<UnoGameBoard3dProps> = ({
  gameState,
  myPlayer,
  currentPlayer,
  isMyTurn,
  myUserName,
  roomId,
  connectionStatus,
  onPlayCard,
  onDrawCard,
  onRestartGame,
  onStopGame,
}) => {
  const [openStopDialog, setOpenStopDialog] = useState<boolean>(false);

  // Render game status section
  const renderGameStatus = () => {
    return (
      <Box sx={{ mb: 3, textAlign: "center" }}>
        {gameState.game_over === true && (
          <Alert
            severity="info"
            sx={{ display: "flex", alignItems: "center" }} 
            action={
              <Button color="primary" size="small" variant="contained" onClick={onRestartGame}>
                Redémarrer
              </Button>
            }
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="subtitle1">Fin de la partie! Victoire:</Typography>
              {gameState.winner.user.profile_picture && (
                <Avatar
                  src={gameState.winner.user.profile_picture}
                  sx={{ width: 32, height: 32, marginRight: 1, marginLeft: 1}}
                />
              )}
              <Typography variant="subtitle1">{gameState.winner.user.username || "Nobody"}</Typography>
            </Box>
          </Alert>
        )}

        {gameState.game_over === false && (
          <Box>
            <Typography variant="h6">
              Tour: {currentPlayer?.user.username}
              {currentPlayer?.hand === 1 && <span style={{ color: "red" }}> UNO!</span>}
            </Typography>
            <Typography variant="body2">Direction: {gameState.direction === true ? "→" : "←"}</Typography>
            <Button
              color="error"
              size="small"
              variant="outlined"
              onClick={() => setOpenStopDialog(true)}
              sx={{ mt: 1 }}
            >
              Arrêter la partie
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Game header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          UNO 3D
        </Typography>
        <Chip label={`Room #${roomId}`} variant="outlined" size="small" sx={{ mr: 1 }} />
        <Chip
          label={connectionStatus}
          color={connectionStatus === "connected" ? "success" : "error"}
          size="small"
        />
      </Box>

      {/* Game status section */}
      {renderGameStatus()}

      {/* 3D Game Canvas */}
      <Box sx={{ height: "500px", width: "100%", mb: 3, borderRadius: "8px", overflow: "hidden" }}>
        <Canvas shadows dpr={[1, 2]}>
          <Game3DScene
            gameState={gameState}
            myPlayer={myPlayer}
            isMyTurn={isMyTurn}
            onPlayCard={onPlayCard}
            onDrawCard={onDrawCard}
          />
        </Canvas>
      </Box>

      {/* Game instructions */}
      {isMyTurn && (
        <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 2, color: "green" }}>
          C'est à toi de jouer! Pose une carte ou pioche dans la pile.
        </Typography>
      )}

      {/* Stop Game Confirmation Dialog */}
      <Dialog open={openStopDialog} onClose={() => setOpenStopDialog(false)}>
        <DialogTitle>Confirmer l'arrêt de la partie</DialogTitle>
        <DialogContent>
          <Typography>
            Attention : Cette action arrêtera la partie pour tous les joueurs. Êtes-vous sûr de vouloir
            continuer ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStopDialog(false)}>Annuler</Button>
          <Button
            onClick={() => {
              onStopGame();
              setOpenStopDialog(false);
            }}
            color="error"
            variant="contained"
          >
            Arrêter la partie
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UnoGameBoard3d;
