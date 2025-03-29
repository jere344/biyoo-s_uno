import React, { useState, useMemo } from "react";
import { Text, Text3D, useFont } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import IUnoPlayer from "@DI/IUnoPlayer";
import IUnoCard from "@DI/IUnoCard";
import UnoCard3D from "./UnoCard3D";
import RobloxAvatar from "./RobloxAvatar.tsx";
import fontPath from "@assets/fonts/Roboto-Black_Regular_exclamation.json"; // a custom version with only the exclamation mark

// Custom hook to preload the font
const usePreloadedFont = () => {
    return useMemo(() => {
        useFont.preload(fontPath);
        return fontPath;
    }, []);
};

interface ProfilePictureProps {
    imageUrl: string;
    position: [number, number, number];
    rotation: [number, number, number];
}

// Profile Picture Component
const ProfilePicture = ({ imageUrl, position, rotation }: ProfilePictureProps) => {
    try {
        const texture = useLoader(TextureLoader, imageUrl);
        return (
            <mesh position={position} rotation={rotation}>
                <circleGeometry args={[0.6, 32]} />
                <meshBasicMaterial map={texture} />
            </mesh>
        );
    }
    catch (e) {
        return null;
    }
};

interface OtherPlayerHandProps {
    player: IUnoPlayer;
    tableRadius: number;
    angle: number;
    cardWidth: number;
    onDenyUno: (playerId: number) => void;
    isAnimating: boolean;
    isDrawing: boolean;
    animatingCard: IUnoCard | null;
    onAnimationComplete: () => void;
    onDrawingAnimationComplete: () => void;
    cardBackImage: string | undefined;
}

const OtherPlayerHand: React.FC<OtherPlayerHandProps> = ({
    player, 
    tableRadius, 
    angle, 
    cardWidth, 
    onDenyUno,
    isAnimating,
    isDrawing,
    animatingCard,
    onAnimationComplete,
    onDrawingAnimationComplete,
    cardBackImage
}) => {
    const [hoveredDenialId, setHoveredDenialId] = useState<number | null>(null);
    const preloadedFont = usePreloadedFont();

    // Position calculation (on a circle around the table)
    const x = tableRadius * Math.sin(angle);
    const z = tableRadius * Math.cos(angle);

    // Rotation to face center of table
    const rotationY = Math.PI + angle;

    // If player has no cards, return null
    if (!player.hand || (typeof player.hand === "object") || player.hand <= 0) return null;

    const cardsPerRow = Math.min(7, player.hand);

    // Render the cards
    const cards = Array.from({ length: player.hand }).map((_, cardIndex) => {
        const row = Math.floor(cardIndex / cardsPerRow);
        const col = cardIndex % cardsPerRow;

        const totalWidth = Math.min(player.hand, cardsPerRow) * cardWidth;
        const startX = -totalWidth / 2 + cardWidth / 2;

        const cardX = startX + col * cardWidth;
        const cardZ = 0.3 * row;

        // Create a dummy card object with the back image
        const dummyCard = {
            id: -1 * (player.id * 1000 + cardIndex), // Unique negative ID
            image: player.card_back?.image || cardBackImage,
            color: "",
            value: "",
            can_play: false,
        };

        return (
            <UnoCard3D
                key={`card-${player.id}-${cardIndex}`}
                card={dummyCard}
                position={[
                    x + cardX * Math.cos(rotationY),
                    cardWidth - 0.1 * row,
                    z + cardX * Math.sin(rotationY) + cardZ * Math.cos(rotationY),
                ]}
                rotation={[0, rotationY, 0]}
                scale={[cardWidth, cardWidth, 0.1]}
            />
        );
    });

    // Add animation for playing card if this player is currently animating
    if (isAnimating && animatingCard) {
        cards.push(
            <UnoCard3D
                key={`card-${player.id}-animating`}
                card={animatingCard}
                cardBack={player.card_back}
                position={[0, 0.1, 0]}
                rotation={[-Math.PI / 2, rotationY, 0]}
                scale={[1.5, 1.5, 0.1]}
                originalPosition={[
                    x + (player.hand % cardsPerRow) * cardWidth * Math.cos(rotationY),
                    cardWidth - 0.1 * Math.floor(player.hand / cardsPerRow),
                    z + (player.hand % cardsPerRow) * cardWidth * Math.sin(rotationY) + 0.3 * Math.floor(player.hand / cardsPerRow) * Math.cos(rotationY),
                ]}
                originalRotation={[0, rotationY + Math.PI, 0]}
                originalScale={[cardWidth, cardWidth, 0.1]}
                animationDuration={0.3}
                onAnimationComplete={onAnimationComplete}
            />
        );
    }

    // Add animation for drawing card if this player is currently drawing
    if (isDrawing && animatingCard) {
        cards.push(
            <UnoCard3D
                key={`card-${player.id}-drawing`}
                card={animatingCard}
                cardBack={player.card_back}
                position={[
                    x,
                    cardWidth,
                    z,
                ]}
                rotation={[0, rotationY + Math.PI, 0]}
                scale={[cardWidth, cardWidth, 0.1]}
                originalPosition={[-2.5, 0, 1]}
                originalRotation={[-Math.PI / 2, 0, 0]}
                originalScale={[1, 1.5, 0.01]}
                animationDuration={0.3}
                onAnimationComplete={onDrawingAnimationComplete}
            />
        );
    }

    return (
        <>
            {/* Player's name - now on the table */}
            <Text
                position={[x * 0.70, 0.01, z * 0.70]} // Position on the table
                rotation={[-Math.PI / 2, 0, -rotationY]}
                color="white"
                fontSize={0.4}
                outlineWidth={0.04}
                outlineColor="black"
                anchorX="center"
                anchorY="middle"
            >
                {player.user.username} ({player.hand})
            </Text>
            
            {/* Profile picture - now on the table */}
            {player.user?.profile_picture && (
                <ProfilePicture 
                    imageUrl={player.user.profile_picture}
                    position={[x * 0.9, 0.02, z * 0.9]} // Position on the table
                    rotation={[-Math.PI / 2, 0, -rotationY]} // Laying flat on the table
                />
            )}
            
            {/* UNO denial button */}
            {player.hand === 1 && player.said_uno === false && (
                <Text3D
                    font={preloadedFont}
                    position={[x, 0.5, z]}
                    rotation={[0, rotationY, 0]}
                    scale={hoveredDenialId === player.id ? [3.5, 3.5, 2.5] : [3, 3, 2]}
                    anchorX="center"
                    anchorY="middle"
                    onClick={() => onDenyUno(player.user.id)}
                    onPointerEnter={() => setHoveredDenialId(player.id)}
                    onPointerLeave={() => setHoveredDenialId(null)}
                >
                    !
                    <meshBasicMaterial
                        transparent
                        color={hoveredDenialId === player.id ? "rgb(203, 15, 15)" : "rgb(188, 58, 58))"}
                        opacity={hoveredDenialId === player.id ? 0.8 : 0.5}
                    />
                </Text3D>
            )}
            
            {/* Roblox Avatar */}
            <RobloxAvatar 
                playerName={player.user.username} 
                scale={1} 
                position={[x, 0.5, z - 3.5]} 
                rotation={[0, Math.PI + rotationY, 0]} 
            />
            
            {/* Cards */}
            {cards}
        </>
    );
};

export default OtherPlayerHand;
