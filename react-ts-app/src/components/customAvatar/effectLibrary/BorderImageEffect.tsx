import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { calcGeneratorDuration } from "framer-motion";

// Styled container for the border image effect
const BorderImageContainer = styled(Box)(({ size, borderWidth, imageUrl }: { size: number; borderWidth: number; imageUrl: string }) => ({
    position: "relative",
    width: size,
    height: size,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

// The actual image border element
const ImageBorder = styled(Box)(({ size, borderWidth, imageUrl }: { size: number; borderWidth: number; imageUrl: string }) => ({
    position: "absolute",
    width: `${size + borderWidth*2}px`,
    height: `${size + borderWidth*2}px`,
    top: -borderWidth,
    left: -borderWidth,
    borderRadius: "50%",
    background: `url(${imageUrl}) center center / cover no-repeat`,
    maskImage: "radial-gradient(circle, transparent 40%, black 40%)",
    WebkitMaskImage: "radial-gradient(circle, transparent 40%, black 40%)",
    zIndex: 0,
}));

interface BorderImageEffectProps {
    children: React.ReactNode;
    size: number;
    imageUrl: string;
    borderWidth?: number;
}

export const BorderImageEffect: React.FC<BorderImageEffectProps> = ({ children, size, imageUrl, borderWidth }) => {
    if (!borderWidth) {
        borderWidth = size * 0.1;
    }
    return (
        <BorderImageContainer size={size} borderWidth={borderWidth} imageUrl={imageUrl}>
            {/* The actual avatar */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {children}
            </Box>

            {/* The image border */}
            <ImageBorder size={size} borderWidth={borderWidth} imageUrl={imageUrl} />
        </BorderImageContainer>
    );
};
