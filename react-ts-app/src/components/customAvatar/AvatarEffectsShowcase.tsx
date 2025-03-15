import React from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";
import { CustomAvatar } from "./CustomAvatar";
import { IUser } from "../../data_interfaces/IUser";

// List of all available effects
const availableEffects = [
    "fire",
    "rainbow",
    "pulse",
    "rotate",
    "glow",
    "3d",
    "particles",
    "shadow",
    "bounce",
    "ripple",
    undefined, // Default (no effect)
];

interface AvatarEffectsShowcaseProps {
    username?: string;
    profilePicture?: File | null;
    avatarSize?: number;
}

export const AvatarEffectsShowcase: React.FC<AvatarEffectsShowcaseProps> = ({
    username = "Player",
    profilePicture = null,
    avatarSize = 60,
}) => {
    // Create a mock user for display purposes
    const createUserWithEffect = (effect?: string): IUser => ({
        username,
        profile_picture: profilePicture,
        is_online: true,
        cards_currency: 100,
        games_played: 10,
        games_won: 5,
        room_id: 0,
        profile_effect: effect,
    });

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Available Avatar Effects
            </Typography>
            <Grid container spacing={3}>
                {availableEffects.map((effect, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: "100%",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <CustomAvatar
                                    user={createUserWithEffect(effect)}
                                    size={avatarSize}
                                    showOnlineStatus={true}
                                />
                            </Box>
                            <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    color: "primary.main",
                                }}
                            >
                                {effect || "Default"}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AvatarEffectsShowcase;
