import React from "react";
import { Typography, Grid, Paper, Box, Chip } from "@mui/material";
import UnoGameCard from "./UnoGameCard";

interface UnoOpponentsListProps {
    gameState: UnoGame;
    currentUser: string;
}

export default function UnoOpponentsList({ gameState, currentUser }: UnoOpponentsListProps) {
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
}
