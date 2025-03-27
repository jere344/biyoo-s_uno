import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useUnoGame } from "@hooks/useUnoGame";

const LobbyMenu: React.FC = () => {
    const { startGame, gameStatus, connectedCount, wsService } = useUnoGame();

    
    // If game is not in lobby state or doesn't exist, don't render
    if (gameStatus !== "waiting_for_players") {
        return null;
    }

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
                padding: 3,
            }}
        >
            <Typography variant="h4" color="white" sx={{ mb: 3 }}>
                Game Lobby
            </Typography>

            <Box sx={{ width: "100%", maxWidth: 400, mb: 3, bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: 2, p: 2 }}>
                <Typography variant="h6" color="white" sx={{ mb: 2 }}>
                    Players Connected: {connectedCount}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                    {/* Replace with actual player list from game state */}
                    {[...Array(connectedCount)].map((_, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`Player ${index + 1}`} secondary={`Status: Connected`} />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ mb: 2 }} />
            </Box>

            <Button variant="contained" color="primary" onClick={startGame} 
                disabled={connectedCount < 2}
                size="large"
                sx={{ width: "100%", maxWidth: 200 }}
            >
                Start Game
            </Button>
        </Box>
    );
};

export default LobbyMenu;
