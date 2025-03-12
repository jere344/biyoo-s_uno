import React, { useState, useEffect } from "react";
import { Text } from "@react-three/drei";
import IUnoGame from "../../../data_interfaces/IUnoGame";
import IUnoPlayer from "../../../data_interfaces/IUnoPlayer";
import UnoCard3D from "./UnoCard3D";
import DrawPile from "./DrawPile";
import OtherPlayersHands from "./OtherPlayersHands";
import GameEnvironment from "./GameEnvironment";
import PlayerHand from "./PlayerHand";

interface Game3DSceneProps {
    gameState: IUnoGame;
    myPlayer: IUnoPlayer | null;
    isMyTurn: boolean;
    onPlayCard: (cardId: number) => void;
    onDrawCard: () => void;
}

const Game3DScene: React.FC<Game3DSceneProps> = ({ gameState, myPlayer, isMyTurn, onPlayCard, onDrawCard }) => {
    const [delayedCurrentCard, setDelayedCurrentCard] = useState(gameState.current_card);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDelayedCurrentCard(gameState.current_card);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, [gameState.current_card]);

    return (
        <>
            {/* Environment component handles lights, table, grass, etc. */}
            <GameEnvironment />

            {/* Current card in play - uses the delayed state */}
            {delayedCurrentCard && (
                <UnoCard3D
                    card={delayedCurrentCard}
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[1.5, 1.5, 0.1]}
                />
            )}

            {/* Draw pile */}
            <DrawPile
                cardBack={gameState.card_back}
                position={[-2.5, 0, 1]}
                onClick={onDrawCard}
                isPlayable={isMyTurn}
            />

            {/* Player's hand */}
            {myPlayer && <PlayerHand myPlayer={myPlayer} isMyTurn={isMyTurn} onPlayCard={onPlayCard} />}

            {/* Other players' hands */}
            <OtherPlayersHands gameState={gameState} myPlayer={myPlayer} />

            {/* Game direction indicator */}
            <Text position={[0, 0.5, -2]} color="white" fontSize={1.5} outlineWidth={0.05} outlineColor="black">
                {gameState.direction === true ? "→" : "←"}
            </Text>
        </>
    );
};

export default Game3DScene;
