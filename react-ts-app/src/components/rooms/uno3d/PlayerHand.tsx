import React, { useState, useCallback } from "react";
import IUnoPlayer from "@DI/IUnoPlayer";
import UnoCard3D from "./UnoCard3D";
import IUnoCard from "@DI/IUnoCard";

interface PlayerHandProps {
    myPlayer: IUnoPlayer;
    isMyTurn: boolean;
    onPlayCard: (cardId: number) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ myPlayer, isMyTurn, onPlayCard }) => {
    if (typeof myPlayer.hand === 'number') return;
    const [animatingCardId, setAnimatingCardId] = useState<number | null>(null);
    
    const totalWidth = 7;

    const cardWidth = Math.min(totalWidth / myPlayer.hand.length, 1);

    const startX = -totalWidth / 2 + cardWidth / 2;
    const superpose_offset = 0.001;
    
    const handlePlayCard = useCallback((cardId: number) => {
        setAnimatingCardId(cardId);
    }, []);
    
    const handleAnimationComplete = useCallback(() => {
        if (animatingCardId !== null) {
            onPlayCard(animatingCardId);
            // setAnimatingCardId(null); 
            // // we don't set it to null to avoid the card going back to the hand until the server confirms the play
        }
    }, [animatingCardId, onPlayCard]);


    if (!myPlayer?.hand?.length) return null;

    return (
        <>
            {myPlayer.hand.map((card:IUnoCard, index:number) => {
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
        </>
    );
};

export default PlayerHand;
