import React from "react";
import { Box, Typography, Button, Card, CardMedia, Chip } from "@mui/material";
import { motion } from "framer-motion";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IGameEnvironment from "@DI/IGameEnvironment";

interface GameEnvironmentCarouselItemProps {
    environment: IGameEnvironment;
    isActive: boolean;
    xPosition: number;
    zPosition: number;
    scale: number;
    opacity: number;
    distance: number;
    userCardsCurrency: number;
    isOwned: boolean;
    isActiveEnvironment: boolean;
    onPurchase: () => void;
    onActivate: () => void;
}

const GameEnvironmentCarouselItem: React.FC<GameEnvironmentCarouselItemProps> = ({
    environment,
    isActive,
    xPosition,
    zPosition,
    scale,
    opacity,
    distance,
    userCardsCurrency,
    isOwned,
    isActiveEnvironment,
    onPurchase,
    onActivate
}) => {
    return (
        <motion.div
            initial={false}
            animate={{
                x: xPosition,
                z: zPosition,
                scale: scale,
                opacity: opacity,
                rotateY: xPosition < 0 ? 15 : xPosition > 0 ? -15 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
                position: "absolute",
                left: "20%",
                width: "100%",
                zIndex: isActive ? 10 : 5 - distance,
            }}
        >
            <Card
                sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: isActive
                        ? "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(104, 109, 224, 0.6)"
                        : "0 10px 30px rgba(0,0,0,0.3)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    aspectRatio: "16/9", 
                    width: "60%",
                }}
            >
                <CardMedia
                    component="img"
                    image={environment.image}
                    alt={environment.name}
                    sx={{
                        width: "100%",
                        aspectRatio: "16/9",
                        objectFit: "cover",
                    }}
                />

                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Box
                            sx={{
                                p: 3,
                                backgroundImage:
                                    "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)",
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    mb: 1,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "white",
                                        fontWeight: 700,
                                        textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                                    }}
                                >
                                    {environment.name}
                                </Typography>

                                {!isOwned ? (
                                    <Chip
                                        icon={<MonetizationOnIcon />}
                                        label={`${environment.price} Cartes`}
                                        sx={{
                                            bgcolor: "rgba(255, 215, 0, 0.9)",
                                            fontWeight: "bold",
                                            color: "#000",
                                            "& .MuiChip-icon": { color: "#000" },
                                        }}
                                    />
                                ) : isActiveEnvironment ? (
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

                            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                {!isOwned ? (
                                    <Button
                                        onClick={onPurchase}
                                        disabled={userCardsCurrency < environment.price}
                                        variant="contained"
                                        sx={{
                                            background:
                                                "linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)",
                                            borderRadius: "25px",
                                            px: 4,
                                            py: 1,
                                            color: "white",
                                            fontWeight: "bold",
                                            boxShadow: "0 4px 20px rgba(255, 107, 107, 0.5)",
                                            "&:hover": {
                                                background:
                                                    "linear-gradient(45deg, #FF5252 30%, #FF7043 90%)",
                                            },
                                            "&:disabled": {
                                                background: "rgba(255,255,255,0.2)",
                                                color: "rgba(255,255,255,0.6)",
                                            },
                                        }}
                                    >
                                        {userCardsCurrency < environment.price
                                            ? "Pas assez de cartes"
                                            : "Acheter"}
                                    </Button>
                                ) : !isActiveEnvironment ? (
                                    <Button
                                        onClick={onActivate}
                                        variant="contained"
                                        sx={{
                                            background:
                                                "linear-gradient(45deg, #42a5f5 30%, #2196f3 90%)",
                                            borderRadius: "25px",
                                            px: 4,
                                            py: 1,
                                            color: "white",
                                            fontWeight: "bold",
                                            boxShadow: "0 4px 20px rgba(33, 150, 243, 0.5)",
                                            "&:hover": {
                                                background:
                                                    "linear-gradient(45deg, #2196f3 30%, #1976d2 90%)",
                                            },
                                        }}
                                    >
                                        Activer
                                    </Button>
                                ) : (
                                    <Button
                                        disabled
                                        variant="contained"
                                        sx={{
                                            background: "rgba(76, 175, 80, 0.7)",
                                            borderRadius: "25px",
                                            px: 4,
                                            py: 1,
                                            color: "white",
                                            fontWeight: "bold",
                                            "&.Mui-disabled": {
                                                color: "white",
                                            },
                                        }}
                                    >
                                        Environnement actif
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
};

export default GameEnvironmentCarouselItem;
