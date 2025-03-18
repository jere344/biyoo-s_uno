import React, { useState, useEffect } from "react";
import { Text, Html } from "@react-three/drei";
import IUnoGame from "../../../data_interfaces/IUnoGame";
import IUnoPlayer from "../../../data_interfaces/IUnoPlayer";
import UnoCard3D from "./UnoCard3D";
import DrawPile from "./DrawPile";
import OtherPlayersHands from "./OtherPlayersHands";
import Environments from "./environments/Environments";
import PlayerHand from "./PlayerHand";

interface Game3DSceneProps {
    gameState: IUnoGame;
    myPlayer: IUnoPlayer | null;
    isMyTurn: boolean;
    onPlayCard: (cardId: number) => void;
    onDrawCard: () => void;
    onSayUno: () => void;
    onDenyUno: (playerId: number) => void;
}

const Game3DScene: React.FC<Game3DSceneProps> = (
    { gameState, 
        myPlayer, 
        isMyTurn, 
        onPlayCard, 
        onDrawCard, 
        onSayUno,
        onDenyUno
    }) => {
    const [delayedCurrentCard, setDelayedCurrentCard] = useState(gameState.current_card);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDelayedCurrentCard(gameState.current_card);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [gameState.current_card]);

    return (
        <>
            <Environments environment={myPlayer ? myPlayer.game_environment.name : "default"} />
            {/* <Environments environment="hut" /> */}

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
            <OtherPlayersHands gameState={gameState} myPlayer={myPlayer} onDenyUno={onDenyUno} />

            {/* Game direction indicator */}
            <Text position={[0, 0.5, -2]} color="white" fontSize={1.5} outlineWidth={0.05} outlineColor="black">
                {gameState.direction === true ? "→" : "←"}
            </Text>

            {/* Say UNO button */}
            {myPlayer && (myPlayer.hand.length === 1 ||  myPlayer.hand.length === 2) && !myPlayer.said_uno && (
                <Html position={[2.5, -1.5, 0]}>
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#ff0000",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                        onClick={onSayUno}
                    >
                        Say UNO!
                    </button>
                </Html>
            )}

        </>
    );
};

export default Game3DScene;
