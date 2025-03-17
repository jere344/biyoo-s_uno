import React, { useState, useCallback, useEffect, useRef } from "react";
import { Text, Text3D } from "@react-three/drei";
import IUnoGame from "@DI/IUnoGame";
import IUnoPlayer from "@DI/IUnoPlayer";
import IUnoCard from "@DI/IUnoCard";
import UnoCard3D from "./UnoCard3D";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
// import gt from "./gt.json";
import font from "@assets/fonts/Roboto-Black_Regular.json";

// Profile Picture Component
const ProfilePicture = ({ imageUrl, position, rotation }) => {
    const texture = useLoader(TextureLoader, imageUrl);
    return (
        <mesh position={position} rotation={rotation}>
            <circleGeometry args={[0.6, 32]} />
            <meshBasicMaterial map={texture} />
        </mesh>
    );
};

interface OtherPlayersHandsProps {
    gameState: IUnoGame;
    myPlayer: IUnoPlayer | null;
    onDenyUno: (playerId: number) => void;
}

const OtherPlayersHands: React.FC<OtherPlayersHandsProps> = ({ gameState, myPlayer, onDenyUno }) => {
    const cardWidth = 0.8;
    const tableRadius = 4; // Distance from center of table
    const otherPlayers = gameState.players.filter((player) => player.id !== myPlayer?.id);
    
    const [animatingPlayerId, setAnimatingPlayerId] = useState<number | null>(null);
    const [animatingCard, setAnimatingCard] = useState<IUnoCard | null>(null);
    const [drawingPlayerId, setDrawingPlayerId] = useState<number | null>(null);
    const previousHandsRef = useRef<{ [key: number]: number }>({});
    const [hoveredDenialId, setHoveredDenialId] = useState<number | null>(null);

    const handleAnimationComplete = useCallback(() => {
        if (animatingPlayerId !== null) {
            setAnimatingPlayerId(null);
            setAnimatingCard(null);
        }
    }, [animatingPlayerId]);

    const handleDrawingAnimationComplete = useCallback(() => {
        if (drawingPlayerId !== null) {
            setDrawingPlayerId(null);
            setAnimatingCard(null);
        }
    }, [drawingPlayerId]);

    useEffect(() => {
        gameState.players.forEach((player) => {
            if (typeof player.hand !== 'number') return;
            if (previousHandsRef.current[player.id] > player.hand) {
                setAnimatingPlayerId(player.id);
                setAnimatingCard(gameState.current_card);
            } else if (previousHandsRef.current[player.id] < player.hand) {
                setDrawingPlayerId(player.id);
                setAnimatingCard(gameState.current_card);
            }
            previousHandsRef.current[player.id] = player.hand;
        });
    }, [gameState.players, gameState.players.map(player => player.hand).join()]);


    // Calculate positions around the table
    return (
        <>
            {otherPlayers.map((player, index) => {
                index = index + 0.5;
                const angleStep = (2 * Math.PI) / otherPlayers.length;
                const angle = angleStep * index;

                // Position calculation (on a circle around the table)
                const x = tableRadius * Math.sin(angle);
                const z = tableRadius * Math.cos(angle);

                // Rotation to face center of table
                const rotationY = Math.PI + angle;

                // If player has no cards, skip rendering
                if (!player.hand || player.hand <= 0) return null;

                // Render the player's name
                const nameElement = (
                    <Text
                        key={`name-${player.id}`}
                        position={[x, 1.5, z]}
                        rotation={[0, rotationY, 0]}
                        color="white"
                        fontSize={0.5}
                        outlineWidth={0.05}
                        outlineColor="black"
                        anchorX="center"
                        anchorY="bottom"
                    >
                        {player.user.username} ({typeof player.hand === "object" && player.hand !== null
                            ? (console.error("Expected a non-object value for player.hand. It probably means your user is unknown, please reload the page"), Object.keys(player.hand).length)
                            : player.hand} cartes)
                    </Text>
                );
                
                // Add player profile picture
                const profilePictureElement = player.user?.profile_picture ? (
                    <ProfilePicture 
                        key={`profile-${player.id}`}
                        imageUrl={player.user.profile_picture}
                        position={[x, 2.8, z]}
                        rotation={[0, rotationY, 0]}
                    />
                ) : null;
                
                const unoDenialElement = player.hand === 1 && player.said_uno === false ? (
                    <Text3D
                        key={`uno-${player.id}`}
                        font={font}
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
                ) : null;

                // Render the player's cards
                const cardsPerRow = Math.min(7, player.hand);

                
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
                        image: player.card_back?.image || gameState.card_back?.image,
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

                if (player.id === animatingPlayerId && animatingCard) {
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
                            onAnimationComplete={handleAnimationComplete}
                        />
                    );
                }

                if (player.id === drawingPlayerId && animatingCard) {
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
                            onAnimationComplete={handleDrawingAnimationComplete}
                        />
                    );
                }

                return (
                    <React.Fragment key={`player-${player.id}`}>
                        {nameElement}
                        {profilePictureElement}
                        {unoDenialElement}
                        {cards}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default OtherPlayersHands;
