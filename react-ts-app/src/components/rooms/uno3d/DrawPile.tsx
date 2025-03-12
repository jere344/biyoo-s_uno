import React, { useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import UnoCard3D from "./UnoCard3D";

interface DrawPileProps {
    cardBack: {
        image: string;
    };
    position: [number, number, number];
    onClick?: () => void;
    isPlayable: boolean;
}

const DrawPile: React.FC<DrawPileProps> = ({ cardBack, position, onClick, isPlayable }) => {
    const pileRef = useRef<THREE.Group>();
    const scale = [1, 1.5, 0.01];

    // Generate cards array outside the render
    const dummyCards = Array.from({ length: 14 }, (_, i) => {
            const index = i;
            const offset = index * 0.01;

            return (
                <mesh key={index} position={[0, offset, 0]} scale={scale} rotation={[-Math.PI / 2, 0, 0]}>
                    <boxGeometry />
                    <meshStandardMaterial color="#2a2a2a" />
                </mesh>
            );
        });


    return (
        <group ref={pileRef} position={position}>
            {/* top card using UnoCard3D component with click handler */}
            <UnoCard3D 
                card={cardBack}
                position={[0, 0.15, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={[1, 1, 0.1]}
                isPlayable={isPlayable}
                onClick={onClick}
                isMyTurn={isPlayable} // Using isPlayable to determine if it's the player's turn
            />
            {dummyCards}
            <Text
                position={[0, 0, 1]}
                rotation={[-Math.PI / 2, 0, 0]}
                color="white"
                fontSize={0.3}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="black"
                onClick={(e) => e.stopPropagation()}
            >
                DRAW
            </Text>
        </group>
    );
};

export default DrawPile;
