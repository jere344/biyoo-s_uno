import React from "react";
import { Box, Tooltip } from "@mui/material";

interface UnoGameCardProps {
    card: UnoCard;
    modifier?: "default" | "highlight" | "darken";
    isPlayable?: boolean;
    onClick?: () => void;
    size?: "small" | "medium" | "large";
}

export const UnoGameCard: React.FC<UnoGameCardProps> = ({
    card,
    onClick,
    modifier = "default",
    size = "medium",
    isPlayable = false,
}) => {
    // Size configurations
    const sizes = {
        small: { width: "20px", height: "30px", margin: "2px" },
        medium: { width: "80px", height: "120px", margin: "5px" },
        large: { width: "100px", height: "150px", margin: "5px" },
    };

    const { width, height, margin } = sizes[size];
    const highlight = modifier === "highlight";
    const darken = modifier === "darken";
    console.log(card.image);

    const cardStyle: React.CSSProperties = {
        width,
        height,
        margin,
        backgroundImage: `url(${card.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: highlight ? "pointer" : "default",
        border: highlight ? "2px solid gold" : "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: highlight ? "0 4px 8px rgba(255, 215, 0, 0.3)" : "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s, filter 0.2s",
        filter: darken ? "brightness(60%)" : "brightness(100%)", // Darken non-playable cards
        "&:hover": {
            transform: highlight ? "translateY(-10px)" : "none",
            boxShadow: highlight ? "0 8px 16px rgba(255, 215, 0, 0.5)" : "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
    };

    // Card description for tooltip
    const getCardDescription = () => {
        if (!card.color && !card.action) return "Card";
        return `${card.action} ${card.color}`.toUpperCase();
    };

    return (
        <Tooltip title={getCardDescription()} placement="top">
            <Box sx={cardStyle} onClick={() => isPlayable && onClick && onClick()} className="uno-card" />
        </Tooltip>
    );
};

export default UnoGameCard;
