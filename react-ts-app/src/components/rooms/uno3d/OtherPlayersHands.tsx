import React, { useState, useCallback, useEffect, useRef } from "react";
import IUnoGame from "@DI/IUnoGame";
import IUnoPlayer from "@DI/IUnoPlayer";
import IUnoCard from "@DI/IUnoCard";
import OtherPlayerHand from "./OtherPlayerHand";

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

                return (
                    <OtherPlayerHand
                        key={`player-${player.id}`}
                        player={player}
                        tableRadius={tableRadius}
                        angle={angle}
                        cardWidth={cardWidth}
                        onDenyUno={onDenyUno}
                        isAnimating={player.id === animatingPlayerId}
                        isDrawing={player.id === drawingPlayerId}
                        animatingCard={animatingCard}
                        onAnimationComplete={handleAnimationComplete}
                        onDrawingAnimationComplete={handleDrawingAnimationComplete}
                        cardBackImage={gameState.card_back?.image}
                    />
                );
            })}
        </>
    );
};

export default OtherPlayersHands;
