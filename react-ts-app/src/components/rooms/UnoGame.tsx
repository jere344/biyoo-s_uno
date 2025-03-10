import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Button, CircularProgress, Alert, Snackbar } from "@mui/material";
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
    const [currentUser, setCurrentUser] = useState<string>("");

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

    const handlePlayCard = (cardId: number) => {
        if (gameService) {
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
            {/* Error message */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

            {/* Game board component */}
            <UnoGameBoard
                gameState={gameState}
                myPlayer={myPlayer}
                currentPlayer={currentPlayer}
                isMyTurn={isMyTurn}
                currentUser={currentUser}
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
