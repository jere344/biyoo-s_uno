import React, { useState, useCallback } from "react";
import UnoCard3D from "./UnoCard3D";
import IUnoCard from "@DI/IUnoCard";
import { useUnoGame } from "@hooks/useUnoGame";
import ColorPicker from "./ColorPicker.tsx";

const PlayerHand: React.FC = () => {
    const { myPlayer, gameState, isMyTurn, playCard, soundManager } = useUnoGame();
    if (gameState === null || myPlayer === undefined || !Array.isArray(myPlayer.hand)) return null;
    const myPlayerHand: IUnoCard[] = myPlayer.hand;

    const [animatingCardId, setAnimatingCardId] = useState<number | null>(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

    const totalWidth = Math.min(7, myPlayerHand.length * 0.5);

    const cardWidth = totalWidth / myPlayerHand.length;

    const startX = -totalWidth / 2 + cardWidth / 2;
    const superpose_offset = 0.001;

    const handlePlayCard = useCallback((cardId: number) => {
        const card = myPlayerHand.find(c => c.id === cardId);
        
        if (card && card.action && card.action.includes('wild')) {
            setSelectedCardId(cardId);
            setShowColorPicker(true);
        } else {
            setAnimatingCardId(cardId);
        }
    }, [myPlayerHand]);

    const handleColorSelected = useCallback((color: string) => {
        setShowColorPicker(false);
        
        if (selectedCardId !== null) {
            // Store the selected color
            setSelectedColor(color);
            // Start animation after color is selected
            setAnimatingCardId(selectedCardId);
        }
    }, [selectedCardId]);

    const handleAnimationComplete = useCallback(() => {
        if (animatingCardId !== null) {
            // Pass the selected color directly to playCard
            soundManager.playSoundEffect("cardPlay");
            const card = myPlayerHand.find(c => c.id === animatingCardId);
            if (card && card.action && card.action.includes('skip')) {
                soundManager.playSoundEffect("skipCard");
            }
            if (card && card.action && card.action.includes('reverse')) {
                soundManager.playSoundEffect("reverseCard");
            }

            playCard(animatingCardId, selectedColor);
            setAnimatingCardId(null);
            setSelectedCardId(null);
            setSelectedColor(undefined);
        }
    }, [animatingCardId, playCard, selectedColor]);

    return (
        <>
            {myPlayerHand.map((card: IUnoCard, index: number) => {
                const x = startX + index * cardWidth;
                const isPlayable = isMyTurn && card.can_play;
                const isAnimating = card.id === animatingCardId;

                return (
                    <UnoCard3D
                        key={card.id}
                        card={card}
                        cardBack={myPlayer.card_back}
                        position={isAnimating ? [0, 0, 0] : [x, 0.7, 4.5 + superpose_offset * index]}
                        rotation={isAnimating ? [-Math.PI / 2, 0, 0] : [-0.7, 0, 0]}
                        scale={isAnimating ? [1.5, 1.5, 0.1] : [1, 1, 0.1]}
                        onClick={() => handlePlayCard(card.id)}
                        isPlayable={isPlayable && !isAnimating}
                        isMyTurn={isMyTurn}
                        originalPosition={isAnimating ? [x, 0.7, 4.5 + superpose_offset * index] : null}
                        originalRotation={isAnimating ? [-0.7, 0, 0] : null}
                        originalScale={isAnimating ? [1, 1, 0.1] : null}
                        animationDuration={isAnimating ? 0.3 : null}
                        onAnimationComplete={isAnimating ? handleAnimationComplete : null}
                    />
                );
            })}

            {showColorPicker && (
                <ColorPicker onColorSelected={handleColorSelected} />
            )}
        </>
    );
};

export default PlayerHand;
