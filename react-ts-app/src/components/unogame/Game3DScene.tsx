import React from "react";
import { Text } from "@react-three/drei";
import { useUnoGame } from '@hooks/useUnoGame';
import Environments from "./environments/Environments";
import UnoCard3D from "./UnoCard3D";
import DrawPile from "./DrawPile";
import PlayerHand from "./PlayerHand";
import OtherPlayersHands from "./OtherPlayersHands.tsx";


// The 3D scene place main elements in the canvas
const Game3DScene: React.FC = () => {
    const game = useUnoGame();
    if (game.gameState === null) return null; // Handle loading state
    return (
        <>
            <Environments environment={game.myPlayer ? game.myPlayer.game_environment.name : "default"} />
            {/* <Environments environment="hut" /> */}

            {/* Current card in play */}
            <UnoCard3D
                    card={game.gameState.current_card}
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[1.5, 1.6, 0.15]}
            />

            {/* Draw pile */}
            <DrawPile position={[-2.5, 0, 1]} />

            {/* Player's hand */}
            <PlayerHand />

            {/* Other players' hands */}
            <OtherPlayersHands />

            {/* Game direction indicator */}
            <Text position={[0, 0.3, 5.3]} 
                rotation={[-Math.PI / 2, 0, 0]}
            color="white" fontSize={1.5} outlineWidth={0.05} outlineColor="black">
                {game.gameState.direction === true ? "→" : "←"}
            </Text>
        </>
    );
};

export default Game3DScene;
