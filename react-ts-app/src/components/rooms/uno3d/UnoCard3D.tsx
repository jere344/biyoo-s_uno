import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import IUnoCard from "../../../data_interfaces/IUnoCard";

interface UnoCard3DProps {
  card: IUnoCard;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onClick?: () => void;
  isPlayable?: boolean;
  highlight?: boolean;
}

const UnoCard3D: React.FC<UnoCard3DProps> = ({
  card,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 0.1],
  onClick,
  isPlayable = false,
  highlight = false
}) => {
  const texture = useTexture(card.image);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>();
  
  // Animate cards that are playable
  useFrame(() => {
    if (!meshRef.current) return;
    
    if (highlight && hovered) {
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.1;
    } else {
      meshRef.current.position.y = position[1];
    }
  });
  
  const cardColor = new THREE.Color(isPlayable && hovered ? 0xffffaa : 0xffffff);
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        // Stop event propagation and prevent duplicates
        // Without this, the send card event is triggered twice :
        // once by the card, once by the highlight effect
        e.stopPropagation();
        if (isPlayable && onClick) onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <boxGeometry args={[1, 1.5, 0.05]} />
      <meshStandardMaterial 
        map={texture} 
        color={cardColor}
        emissive={highlight && hovered ? new THREE.Color(0xffff00) : undefined}
        emissiveIntensity={highlight && hovered ? 0.3 : 0}
        opacity={isPlayable ? 1 : 0.9}
      />
      {highlight && hovered && (
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.05, 1.55]} />
          <meshBasicMaterial color="gold" transparent opacity={0.3} />
        </mesh>
      )}
    </mesh>
  );
};

export default UnoCard3D;
