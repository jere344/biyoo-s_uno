import React, { useState, useRef, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";

interface DrawPileProps {
  cardBack: {
    image: string;
  };
  position: [number, number, number];
  onClick?: () => void;
  isPlayable: boolean;
}

const DrawPile: React.FC<DrawPileProps> = ({ cardBack, position, onClick, isPlayable }) => {
  const texture = useTexture(cardBack.image);
  const [hovered, setHovered] = useState(false);
  const pileRef = useRef<THREE.Group>();
  const [lastClickTime, setLastClickTime] = useState(0);
  
  // Handle click with debounce
  const handleClick = useCallback((e) => {
    e.stopPropagation();
    
    // Debounce click events (300ms)
    const now = Date.now();
    if (now - lastClickTime < 300) {
      return;
    }
    
    setLastClickTime(now);
    
    if (isPlayable && onClick) {
      onClick();
    }
  }, [isPlayable, onClick, lastClickTime]);
  
  // Create stack of cards effect
  const cards = [];
  for (let i = 0; i < 15; i++) {
    const offset = i * 0.01; // Increased spacing between cards
    const scale = [1, 1.5, 0.01]; // Reduced thickness of cards
    cards.push(
      <mesh key={i} 
        position={[0, offset, 0]} 
        scale={scale}
        rotation={[-Math.PI / 2, 0, 0]}
        // Don't add onClick here to prevent multiple event triggers
      >
        <boxGeometry />
        {i === 14 ? ( // Only apply texture to the top card
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#2a2a2a" /> // Darker color for better contrast
        )}
      </mesh>
    );
  }
  
  useFrame(() => {
    if (!pileRef.current) return;
    if (isPlayable && hovered) {
      pileRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.1;
    } else {
      pileRef.current.position.y = position[1];
    }
  });
  
  return (
    <group 
      ref={pileRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {cards}
      <Text
        position={[0, 0, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="white"
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
        // Prevent the Text from handling clicks separately
        onClick={(e) => e.stopPropagation()}
      >
        DRAW
      </Text>
    </group>
  );
};

export default DrawPile;
