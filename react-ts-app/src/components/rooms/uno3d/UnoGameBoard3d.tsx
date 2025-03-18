import React, { useState, useRef } from "react";
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
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Game3DScene from "./Game3DScene";
import IUnoGame from "../../../data_interfaces/IUnoGame";
import IUnoPlayer from "../../../data_interfaces/IUnoPlayer";

import { OrbitControls } from "@react-three/drei";

export interface UnoGameBoard3dProps {
    gameState: IUnoGame;
    myPlayer: IUnoPlayer | null;
    currentPlayer: IUnoPlayer | null;
    isMyTurn: boolean;
    roomId: number;
    connectionStatus: "connected" | "disconnected" | "connecting";
    onPlayCard: (cardId: number) => void;
    onDrawCard: () => void;
    onRestartGame: () => void;
    onStopGame: () => void;
    onSayUno: () => void;
    onDenyUno: (playerId: number) => void;
}

const UnoGameBoard3d: React.FC<UnoGameBoard3dProps> = ({
    gameState,
    myPlayer,
    currentPlayer,
    isMyTurn,
    roomId,
    connectionStatus,
    onPlayCard,
    onDrawCard,
    onRestartGame,
    onStopGame,
    onSayUno,
    onDenyUno,
}) => {
    const [openStopDialog, setOpenStopDialog] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);

    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (fullscreenContainerRef.current?.requestFullscreen) {
                fullscreenContainerRef.current.requestFullscreen().then(() => {
                    setIsFullscreen(true);
                }).catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    setIsFullscreen(false);
                }).catch(err => {
                    console.error(`Error attempting to exit fullscreen: ${err.message}`);
                });
            }
        }
    };

    // Add event listener for fullscreen change
    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

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
                            {gameState.winner?.user.profile_picture && (
                                <Avatar
                                    src={gameState.winner.user.profile_picture}
                                    sx={{ width: 32, height: 32, marginRight: 1, marginLeft: 1 }}
                                />
                            )}
                            <Typography variant="subtitle1">{gameState.winner?.user.username || "Nobody"}</Typography>
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

            {/* 3D Game Canvas with Fullscreen Button */}
            <Box
                ref={fullscreenContainerRef}
                sx={{
                    height: isFullscreen ? "100vh" : "500px",
                    width: "100%",
                    mb: 3,
                    borderRadius: isFullscreen ? "0" : "8px",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <Canvas shadows dpr={[1, 2]}>
                    <Game3DScene
                        gameState={gameState}
                        myPlayer={myPlayer}
                        isMyTurn={isMyTurn}
                        onPlayCard={onPlayCard}
                        onDrawCard={onDrawCard}
                        onSayUno={onSayUno}
                        onDenyUno={onDenyUno}
                    />
                    <OrbitControls
                        enableZoom={true}
                        minDistance={3}
                        maxDistance={22}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2}
                    />
                </Canvas>
                
                <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
                    <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                        <IconButton 
                            onClick={toggleFullscreen}
                            sx={{ 
                                bgcolor: 'rgba(255, 255, 255, 0.7)', 
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                            }}
                        >
                            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Game instructions - Only show if not in fullscreen */}
            {isMyTurn && !isFullscreen && (
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
