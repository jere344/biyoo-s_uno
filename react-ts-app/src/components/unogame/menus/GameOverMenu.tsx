import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useUnoGame } from "@hooks/useUnoGame";
import IUnoPlayer from "@DI/IUnoPlayer";

const GameOverMenu: React.FC = () => {
    const { gameState, restartGame, gameStatus } = useUnoGame();

    // If game is not over or doesn't exist, don't render
    if (!gameState || gameStatus !== "game_over") {
        return null;
    }

    const winner = gameState.winner;

    const getNumberOfCardsLeft = (player: IUnoPlayer) => {
        // if it's an array, return the length of the array
        if (Array.isArray(player.hand)) {
            return player.hand.length;
        }
        // else it's a number
        return player.hand;
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
                padding: 3,
            }}
        >
            <Typography variant="h4" color="white" sx={{ mb: 2 }}>
                Game Over
            </Typography>

            {winner && (
                <Typography variant="h5" color="gold" sx={{ mb: 3 }}>
                    {winner.user.username} wins!
                </Typography>
            )}

            <Box sx={{ width: "100%", maxWidth: 400, mb: 3, bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: 2, p: 2 }}>
                <Typography variant="h6" color="white" sx={{ mb: 1 }}>
                    Final Scores
                </Typography>
                <Divider sx={{ bgcolor: "white", mb: 1 }} />
                <List>
                    {[...gameState.players]
                        .sort((a, b) => getNumberOfCardsLeft(a) - getNumberOfCardsLeft(b))
                        .map((player) => (
                            <ListItem key={player.player_number}>
                                <ListItemText
                                    primary={player.user.username}
                                    secondary={`Cards left: ${getNumberOfCardsLeft(player)}`}
                                    primaryTypographyProps={{ color: "white" }}
                                    secondaryTypographyProps={{ color: "lightgrey" }}
                                />
                            </ListItem>
                        ))}
                </List>
            </Box>

            <Button variant="contained" color="primary" onClick={restartGame} sx={{ minWidth: 200 }}>
                Play Again
            </Button>
        </Box>
    );
};

export default GameOverMenu;
