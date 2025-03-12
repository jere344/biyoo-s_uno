import React from "react";
import { Typography, Grid, Paper, Box, Chip, Avatar } from "@mui/material";
import UnoGameCard from "./UnoGameCard";

interface UnoOpponentsListProps {
    gameState: UnoGame;
    myPlayer: UnoPlayer;
}

export default function UnoOpponentsList({ gameState, myPlayer }: UnoOpponentsListProps) {
    const opponents = gameState.players.filter((p) => p !== myPlayer);

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Joueurs
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {opponents.map((player) => (
                    <Grid item key={player.user.username}>
                        <Paper
                            sx={{
                                p: 2,
                                textAlign: "center",
                                backgroundColor: gameState.current_player === player.user ? "#e3f2fd" : "white",
                                border: gameState.current_player === player.user ? "2px solid #2196f3" : "none",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                                {player.user.profile_picture && (
                                    <Avatar
                                        src={player.user.profile_picture}
                                        sx={{ width: 32, height: 32, borderRadius: "50%", marginRight: 1 }}
                                    />
                                )}
                                <Typography variant="subtitle1">{player.user.username}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                                { typeof player.hand === "number" && Array.from({ length: player.hand }).map((_, idx) => (
                                    <UnoGameCard key={idx} card={player.card_back} size="small" />
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
}
