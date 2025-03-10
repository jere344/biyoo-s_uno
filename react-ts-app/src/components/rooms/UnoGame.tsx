import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Button, CircularProgress, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { UnoGameWebsocketDS } from "../../data_services/websockets/UnoGameWebsocketDS";
import { useParams } from "react-router-dom";
import { storageUsernameKey, storageAccessTokenKey } from "../../data_services/CustomAxios";
import UnoGameBoard from "./UnoGameBoard";

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
    const [myUserName, setMyUserName] = useState<string>("");
    
    // Color selection state
    const [colorSelectionOpen, setColorSelectionOpen] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    // Add a new state to track if we're ready to connect
    const [isReadyToConnect, setIsReadyToConnect] = useState(false);

    // Split the initialization into two effects
    useEffect(() => {
        const token = localStorage.getItem(storageAccessTokenKey);
        const username = localStorage.getItem(storageUsernameKey);
        
        if (token && username && roomId) {
            setMyUserName(username);
            const service = new UnoGameWebsocketDS(roomId, token);
            setGameService(service);
            setIsReadyToConnect(true);
        }
        
        return () => {
            if (gameService) {
                gameService.disconnect();
            }
        };
    }, [roomId]);

    // Handle WebSocket connection separately
    useEffect(() => {
        if (!gameService || !isReadyToConnect) {
            return;
        }

        const gameSubscription = gameService.gameState$.subscribe((state) => {
            setGameState(state);
        });

        const gamePlayerCountSubscription = gameService.playerCount$.subscribe((count) => {
            setGamePlayerCount(count);
        });

        const connectionSubscription = gameService.connectionStatus$.subscribe((status) => {
            setConnectionStatus(status);
        });

        const errorSubscription = gameService.error$.subscribe((err) => {
            if (err) setError(err);
        });

        // Connect to the WebSocket only when we're ready
        gameService.connect();

        return () => {
            gameSubscription.unsubscribe();
            gamePlayerCountSubscription.unsubscribe();
            connectionSubscription.unsubscribe();
            errorSubscription.unsubscribe();
            gameService.disconnect();
        };
    }, [gameService, isReadyToConnect]);

    const getMyPlayer = (): UnoPlayer | null => {
        if (!gameState || !myUserName) return null;
        return gameState.players.find((p) => p.user.username === myUserName) || null;
    }

    const getCurrentPlayer = (): UnoPlayer | null => {
        if (!gameState) return null;
        return gameState.players.find((p) => p.player_number === gameState.current_player_number) || null;
    };

    const handlePlayCard = (cardId: number) => {
        if (!gameService) return;
        
        // Check if the card requires color selection
        const myPlayer = getMyPlayer();
        if (!myPlayer) return;
        
        const cardToPlay = myPlayer.hand.find(card => card.id === cardId);
        if (!cardToPlay) return;
        
        if (cardToPlay.action.includes("wild")) {
            // Open color selection dialog
            setSelectedCardId(cardId);
            setColorSelectionOpen(true);
        } else {
            // Play card directly
            gameService.playCard(cardId);
        }
    };

    const handleColorSelection = (color: string) => {
        if (gameService && selectedCardId !== null) {
            gameService.playCard(selectedCardId, color);
            setSelectedCardId(null);
        }
        setColorSelectionOpen(false);
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
        }
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
                <Button variant="contained" color="primary" 
                    onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                    Réessayer
                </Button>
            </Paper>
        );
    }

    if (!gameState) {
        return (
            <Paper sx={{ padding: "2rem", textAlign: "center" }}>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Partie non démarrée
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
                        Commencer le jeu avec {gamePlayerCount} joueurs
                    </Button>
                )}
            </Paper>
        );
    }

    const myPlayer = getMyPlayer();
    const currentPlayer = getCurrentPlayer();
    const isMyTurn = myPlayer && currentPlayer && myPlayer.user === currentPlayer.user;
    console.log("myPlayer", myPlayer);

    return (
        <Paper
            sx={{
                padding: "1rem",
                minHeight: "800px",
                backgroundColor: "#f1f8e9",
            }}
        >
            {/* Error message */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

            {/* Color Selection Dialog */}
            <Dialog open={colorSelectionOpen} onClose={() => setColorSelectionOpen(false)}>
                <DialogTitle>Choisir une couleur</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <Button 
                            variant="contained" 
                            onClick={() => handleColorSelection("red")}
                            sx={{ bgcolor: 'red', minWidth: '60px', '&:hover': { bgcolor: 'darkred' } }}
                        >
                            Rouge
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={() => handleColorSelection("blue")}
                            sx={{ bgcolor: 'blue', minWidth: '60px', '&:hover': { bgcolor: 'darkblue' } }}
                        >
                            Bleu
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={() => handleColorSelection("green")}
                            sx={{ bgcolor: 'green', minWidth: '60px', '&:hover': { bgcolor: 'darkgreen' } }}
                        >
                            Vert
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={() => handleColorSelection("yellow")}
                            sx={{ bgcolor: '#FFCC00', minWidth: '60px', color: 'black', '&:hover': { bgcolor: '#E6B800' } }}
                        >
                            Jaune
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setColorSelectionOpen(false)}>Annuler</Button>
                </DialogActions>
            </Dialog>

            {/* Game board component */}
            <UnoGameBoard
                gameState={gameState}
                myUserName={myUserName}
                myPlayer={myPlayer}
                currentPlayer={currentPlayer}
                isMyTurn={isMyTurn}
                roomId={roomId}
                connectionStatus={connectionStatus}
                onPlayCard={handlePlayCard}
                onDrawCard={handleDrawCard}
                onRestartGame={handleRestartGame}
                onStopGame={handleStopGame}
            />
        </Paper>
    );
}
