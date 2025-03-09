import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Button, Grid, CircularProgress, Alert, Snackbar, Divider, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { UnoGameWebsocketDS } from "../../data_services/websockets/UnoGameWebsocketDS";
import { useParams } from "react-router-dom";
import { storageUsernameKey, storageAccessTokenKey } from "../../data_services/CustomAxios";
import UnoGameCard from "./UnoGameCard";

export default function UnoGame() {
    const { id } = useParams(); // room id from route params
    const roomId = parseInt(id as string, 10);
    const [gameService, setGameService] = useState<UnoGameWebsocketDS | null>(null);
    const [gameState, setGameState] = useState<UnoGame | null>(null);
    const [gamePlayerCount, setGamePlayerCount] = useState<number>(0);
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">(
        "disconnected"
    );
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<string>("");
    const [openStopDialog, setOpenStopDialog] = useState<boolean>(false);

    // Initialize the game service and connect to WebSocket
    useEffect(() => {
        // Get token from localStorage or other auth system
        const token = localStorage.getItem(storageAccessTokenKey);
        const username = localStorage.getItem(storageUsernameKey);
        setCurrentUser(username);

        if (roomId) {
            const service = new UnoGameWebsocketDS(parseInt(roomId), token);
            setGameService(service);

            // Subscribe to observables from the service
            const gameSubscription = service.gameState$.subscribe((state) => {
                setGameState(state);
            });

            const gamePlayerCountSubscription = service.playerCount$.subscribe((count) => {
                setGamePlayerCount(count);
            });

            const connectionSubscription = service.connectionStatus$.subscribe((status) => {
                setConnectionStatus(status);
            });

            const errorSubscription = service.error$.subscribe((err) => {
                if (err) setError(err);
            });

            // Connect to the WebSocket
            service.connect();

            // Clean up on component unmount
            return () => {
                gameSubscription.unsubscribe();
                gamePlayerCountSubscription.unsubscribe();
                connectionSubscription.unsubscribe();
                errorSubscription.unsubscribe();
                service.disconnect();
            };
        }
    }, [roomId]);

    const getMyPlayer = (): UnoPlayer | null => {
        if (!gameState || !currentUser) return null;
        return gameState.players.find((p) => p.user === currentUser) || null;
    }

    const getCurrentPlayer = (): UnoPlayer | null => {
        if (!gameState) return null;
        return gameState.players.find((p) => p.player_number === gameState.current_player_number) || null;
    };

    const handlePlayCard = (cardId: number | undefined) => {
        if (cardId !== undefined && gameService) {
            gameService.playCard(cardId);
        }
    };

    const handleDrawCard = () => {
        if (gameService) {
            gameService.drawCard();
        }
    };

    const handleStartGame = () => {
        if (gameService) {
            gameService.startGame();
        }
    };

    const handleRestartGame = () => {
        if (gameService) {
            gameService.restartGame();
        }
    };

    const handleStopGame = () => {
        if (gameService) {
            gameService.stopGame();
            setOpenStopDialog(false);
        }
    };

    // Render opponents (other players)
    const renderOpponents = () => {
        if (!gameState) return null;

        const opponents = gameState.players.filter((p) => p.user !== currentUser);

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Joueurs
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {opponents.map((player) => (
                        <Grid item key={player.user}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    backgroundColor: gameState.current_player === player.user ? "#e3f2fd" : "white",
                                    border: gameState.current_player === player.user ? "2px solid #2196f3" : "none",
                                }}
                            >
                                <Typography variant="subtitle1">{player.user}</Typography>
                                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                                    { typeof player.hand === "number" && Array.from({ length: player.hand }).map((_, idx) => (
                                        <UnoGameCard key={idx} card={player.placeholder} size="small" />
                                    ))}
                                </Box>
                                <Chip
                                    label={`${player.hand} cartes`}
                                    size="small"
                                    color={player.hand <= 2 ? "error" : "default"}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    // Render game status section
    const renderGameStatus = () => {
        if (!gameState) return null;

        return (
            <Box sx={{ mb: 3, textAlign: "center" }}>
                {gameState.game_over == true && (
                    <Alert 
                        severity="info" 
                        action={
                            <Button 
                                color="primary" 
                                size="small" 
                                variant="contained"
                                onClick={handleRestartGame}
                            >
                                Redémarrer
                            </Button>
                        }
                    >
                        Fin de la partie! Victoire: {gameState.winner || "Nobody"}
                    </Alert>
                )}

                {gameState.game_over == false  && (
                    <Box>
                        <Typography variant="h6">
                            Tour: {currentPlayer?.user}
                            {currentPlayer?.hand === 1 && <span style={{ color: "red" }}> UNO!</span>}
                        </Typography>
                        <Typography variant="body2">
                            Direction: {gameState.direction === true ? "→" : "←"}
                        </Typography>
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

    // Main render method
    if (connectionStatus === "connecting") {
        return (
            <Paper sx={{ padding: "2rem", textAlign: "center" }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Connexion au jeu...
                </Typography>
            </Paper>
        );
    }

    if (connectionStatus === "disconnected") {
        return (
            <Paper sx={{ padding: "2rem", textAlign: "center" }}>
                <Alert severity="error">
                    Déconnecté du serveur de jeu.
                    {error && <Box mt={1}>{error}</Box>}
                </Alert>
                <Button variant="contained" color="primary" onClick={() => gameService?.connect()} sx={{ mt: 2 }}>
                    Réessayer
                </Button>
            </Paper>
        );
    }

    if (!gameState) {
        return (
            <Paper sx={{ padding: "2rem", textAlign: "center" }}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    En attente des autres joueurs...
                </Typography>
                {gamePlayerCount > 0 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {gamePlayerCount} joueur(s) connecté(s)
                    </Typography>
                )}
                {/* start button if there are more than 2 players */}
                {gamePlayerCount > 1 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartGame}
                        sx={{ mt: 2 }}
                        disabled={gamePlayerCount < 2}
                    >
                        Commencer le jeu
                    </Button>
                )}
            </Paper>
        );
    }

    const myPlayer = getMyPlayer();
    const currentPlayer = getCurrentPlayer();
    const isMyTurn = myPlayer && currentPlayer && myPlayer.user === currentPlayer.user;

    return (
        <Paper
            sx={{
                padding: "1rem",
                minHeight: "800px",
                backgroundColor: "#f1f8e9",
            }}
        >
            {/* Game header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    UNO
                </Typography>
                <Chip label={`Room #${roomId}`} variant="outlined" size="small" sx={{ mr: 1 }} />
                <Chip
                    label={connectionStatus}
                    color={connectionStatus === "connected" ? "success" : "error"}
                    size="small"
                />
            </Box>

            {/* Error message */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

            {/* Game status section */}
            {renderGameStatus()}

            {/* Other players section */}
            {renderOpponents()}

            {/* Game board section */}
            <Box sx={{ mb: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ position: "relative", width: "250px", height: "200px" }}>
                    {/* current card */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        {gameState.current_card && (
                            <UnoGameCard card={gameState.current_card} size="large" />
                        )}
                    </Box>

                    {/* Draw pile */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "10%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                       
                        <UnoGameCard card={gameState.placeholder} isPlayable={isMyTurn} modifier={isMyTurn ? "highlight" : "default"} onClick={handleDrawCard} />
                        <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1 }}>
                            Pioche
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Player's hand section */}
            <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 2 }}>
                    <Chip label="Votre Main" />
                </Divider>

                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    {myPlayer?.hand.length > 0 ? (
                        myPlayer.hand.map((card) => 
                            <UnoGameCard key={card.id} card={card} 
                                isPlayable={isMyTurn && card.can_play} 
                                modifier={isMyTurn ? (card.can_play ? "highlight" : "darken") : "default"}
                                onClick={() => handlePlayCard(card.id)} 
                            />)
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            Tu n'as pas de cartes.
                        </Typography>
                    )}
                </Box>

                {isMyTurn && (
                    <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 2, color: "green" }}>
                        C'est à toi de jouer! Pose une carte ou pioche dans la pile.
                    </Typography>
                )}
            </Box>

            {/* Stop Game Confirmation Dialog */}
            <Dialog open={openStopDialog} onClose={() => setOpenStopDialog(false)}>
                <DialogTitle>Confirmer l'arrêt de la partie</DialogTitle>
                <DialogContent>
                    <Typography>
                        Attention : Cette action arrêtera la partie pour tous les joueurs. Êtes-vous sûr de vouloir continuer ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStopDialog(false)}>Annuler</Button>
                    <Button onClick={handleStopGame} color="error" variant="contained">
                        Arrêter la partie
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
