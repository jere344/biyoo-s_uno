import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IProfileEffect from "@DI/IProfileEffect";
import { IUser } from "@DI/IUser";
import CustomAvatar from "@components/customAvatar/CustomAvatar.tsx";

interface AvatarEffectItemProps {
    effect: IProfileEffect;
    user: IUser;
    isOwned: boolean;
    isEquipped: boolean;
    onPress: (effectId: number) => void;
}

const AvatarEffectItem: React.FC<AvatarEffectItemProps> = ({ effect, user, isOwned, isEquipped, onPress }) => {
    if (!effect || !user) {
        return null;
    }

    const userWithEffect = { ...user, profile_effect: effect.name };
    const isAffordable = user.cards_currency >= effect.price;
    const isPressable = (isOwned && !isEquipped) || (!isOwned && isAffordable);
    
    return (
        <Grid item xs={12} sm={6} md={4} key={effect.id}>
            <motion.div
                whileHover={{
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <Card
                    sx={{
                        background: "linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                        borderRadius: "15px",
                        overflow: "visible",
                        position: "relative",
                    }}
                >
                    <Box sx={{ 
                        paddingTop: 7,
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                        }}>
                            {!isOwned ? (
                                <Chip
                                    icon={<MonetizationOnIcon />}
                                    label={`${effect.price} Cartes`}
                                    sx={{
                                        bgcolor: "rgba(255, 215, 0, 0.9)",
                                        fontWeight: "bold",
                                        color: "#000",
                                        "& .MuiChip-icon": { color: "#000" },
                                    }}
                                />
                            ) : isEquipped ? (
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Actif"
                                    sx={{
                                        bgcolor: "rgba(76, 175, 80, 0.9)",
                                        fontWeight: "bold",
                                        color: "white",
                                    }}
                                />
                            ) : (
                                <Chip
                                    label="Possédé"
                                    sx={{
                                        bgcolor: "rgba(255, 255, 255, 0.9)",
                                        fontWeight: "bold",
                                        color: "#000",
                                    }}
                                />
                            )}
                        </Box>
                        <CustomAvatar user={userWithEffect} size={100} showOnlineStatus={false} />
                    </Box>

                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                textAlign: "center",
                                textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
                            }}
                        >
                            {effect.name}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                textAlign: "center",
                                mb: 2,
                            }}
                        >
                            {effect.description}
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <motion.div whileHover={{ scale: isPressable ? 1.1 : 1 }} whileTap={{ scale: isPressable ? 0.9 : 1 }}>
                                <Button
                                    variant="contained"
                                    disabled={!isPressable}
                                    startIcon={<AutoFixHighIcon />}
                                    sx={{
                                        background: "linear-gradient(45deg, #ab47bc 30%, #8e24aa 90%)",
                                        color: "white",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                        borderRadius: "25px",
                                        boxShadow: "0 4px 20px rgba(156, 39, 176, 0.5)",
                                        textTransform: "uppercase",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        opacity: isPressable ? 1 : 0.5,
                                        position: "relative",
                                        "&:disabled": {
                                            background: "linear-gradient(45deg, #9e9e9e 30%, #757575 90%)",
                                            color: "#e0e0e0",
                                            boxShadow: "none",
                                            "&::after": {
                                                content: (!isOwned && !isAffordable) ? '"Pas assez de cartes"' : '""' ,
                                                position: "absolute",
                                                bottom: "-20px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                fontSize: "0.7rem",
                                                color: "#ff5252",
                                                whiteSpace: "nowrap",
                                            }
                                        }
                                    }}
                                    onClick={() => onPress(effect.id)}
                                >
                                    {isOwned ? "Activer" : "Acheter"}
                                </Button>
                            </motion.div>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </Grid>
    );
};

export default AvatarEffectItem;
