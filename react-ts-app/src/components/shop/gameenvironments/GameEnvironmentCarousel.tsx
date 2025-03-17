import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IGameEnvironment from "@DI/IGameEnvironment";
import GameEnvironmentCarouselItem from "./GameEnvironmentCarouselItem";

interface GameEnvironmentCarouselProps {
    environments: IGameEnvironment[];
    loading: boolean;
    userCardsCurrency: number;
    isOwned: (envId: number) => boolean;
    isActive: (envId: number) => boolean;
    getInventoryId: (envId: number) => number | null;
    onPurchase: (envId: number) => Promise<void>;
    onActivate: (inventoryId: number) => Promise<void>;
}

const GameEnvironmentCarousel: React.FC<GameEnvironmentCarouselProps> = ({
    environments,
    loading,
    userCardsCurrency,
    isOwned,
    isActive,
    getInventoryId,
    onPurchase,
    onActivate
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === environments.length - 1 ? 0 : prevIndex + 1));
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? environments.length - 1 : prevIndex - 1));
    };

    if (loading) {
        return (
            <Box sx={{ height: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h5" sx={{ color: "#fff", opacity: 0.8 }}>
                    Chargement des environnements...
                </Typography>
            </Box>
        );
    }

    if (environments.length === 0) {
        return (
            <Box
                sx={{
                    height: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "rgba(0,0,0,0.4)",
                    borderRadius: "16px",
                }}
            >
                <Typography variant="h5" sx={{ color: "#fff", opacity: 0.8 }}>
                    Aucun environnement disponible pour le moment
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ position: "relative", height: "400px", width: "100%", overflow: "hidden" }}>
            <Box sx={{ position: "relative", perspective: "1200px", width: "100%" }}>
                {environments.map((env, index) => {
                    const distance = Math.abs(currentIndex - index);
                    const isActiveItem = index === currentIndex;

                    // For a circular effect
                    if (distance > 2) return null;

                    let xPosition = 0;
                    let zPosition = 0;
                    let scale = 1;
                    let opacity = 1;

                    if (index < currentIndex) {
                        // Items to the left
                        xPosition = -300 * distance;
                        zPosition = -200 * distance;
                        scale = 1 - 0.2 * distance;
                        opacity = 1 - 0.3 * distance;
                    } else if (index > currentIndex) {
                        // Items to the right
                        xPosition = 300 * distance;
                        zPosition = -200 * distance;
                        scale = 1 - 0.2 * distance;
                        opacity = 1 - 0.3 * distance;
                    }

                    return (
                        <GameEnvironmentCarouselItem
                            key={env.id}
                            environment={env}
                            isActive={isActiveItem}
                            xPosition={xPosition}
                            zPosition={zPosition}
                            scale={scale}
                            opacity={opacity}
                            distance={distance}
                            userCardsCurrency={userCardsCurrency}
                            isOwned={isOwned(env.id)}
                            isActiveEnvironment={isActive(env.id)}
                            onPurchase={() => onPurchase(env.id)}
                            onActivate={() => {
                                const inventoryId = getInventoryId(env.id);
                                if (inventoryId !== null) {
                                    onActivate(inventoryId);
                                }
                            }}
                        />
                    );
                })}
            </Box>

            {environments.length > 1 && (
                <>
                    <IconButton
                        onClick={handlePrevious}
                        sx={{
                            position: "absolute",
                            left: { xs: 0, sm: 20 },
                            top: "50%",
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            "&:hover": {
                                bgcolor: "rgba(104, 109, 224, 0.8)",
                            },
                            zIndex: 20,
                        }}
                    >
                        <ArrowBackIosNewIcon />
                    </IconButton>

                    <IconButton
                        onClick={handleNext}
                        sx={{
                            position: "absolute",
                            right: { xs: 0, sm: 20 },
                            top: "50%",
                            transform: "translateY(-50%)",
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            "&:hover": {
                                bgcolor: "rgba(104, 109, 224, 0.8)",
                            },
                            zIndex: 20,
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </>
            )}
        </Box>
    );
};

export default GameEnvironmentCarousel;
