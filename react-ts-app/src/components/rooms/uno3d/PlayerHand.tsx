import React from "react";
import IUnoPlayer from "../../../data_interfaces/IUnoPlayer";
import UnoCard3D from "./UnoCard3D";

interface PlayerHandProps {
    myPlayer: IUnoPlayer;
    isMyTurn: boolean;
    onPlayCard: (cardId: number) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ myPlayer, isMyTurn, onPlayCard }) => {
    if (!myPlayer?.hand?.length) return null;

    const cardWidth = 1;
    const totalWidth = myPlayer.hand.length * cardWidth;
    const startX = -totalWidth / 2 + cardWidth / 2;
    const superpose_offset = 0.01;

    return (
        <>
            {myPlayer.hand.map((card, index) => {
                const x = startX + index * cardWidth;
                const isPlayable = isMyTurn && card.can_play;

                return (
                    <UnoCard3D
                        key={card.id}
                        card={card}
                        position={[x, 0.7, 4.5 + superpose_offset * index]}
                        rotation={[-0.7, 0, 0]}
                        onClick={() => onPlayCard(card.id)}
                        isPlayable={isPlayable}
                        isMyTurn={isMyTurn}
                    />
                );
            })}
        </>
    );
};

export default PlayerHand;
