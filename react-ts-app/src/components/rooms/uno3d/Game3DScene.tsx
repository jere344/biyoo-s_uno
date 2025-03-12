import React from "react";
import { OrbitControls, Text } from "@react-three/drei";
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
    return (
        <>
            {/* Environment component handles lights, table, grass, etc. */}
            <GameEnvironment />

            {/* Current card in play */}
            {gameState.current_card && (
                <UnoCard3D
                    card={gameState.current_card}
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

            <OrbitControls
                enableZoom={true}
                minDistance={3}
                maxDistance={12}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
};

export default Game3DScene;
