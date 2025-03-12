import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import IUnoCard from "../../../data_interfaces/IUnoCard";

interface UnoCard3DProps {
    card: IUnoCard;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    onClick?: () => void;
    isPlayable?: boolean;
    isMyTurn?: boolean;
}

const UnoCard3D: React.FC<UnoCard3DProps> = ({
    card,
    position,
    rotation = [0, 0, 0],
    scale = [1, 1, 0.1],
    onClick,
    isPlayable = false,
    isMyTurn = false,
}) => {
    // Create a default texture using a small canvas filled with a placeholder color
    const defaultTexture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        if (context) {
            context.fillStyle = "#CCCCCC"; // placeholder color (light gray)
            context.fillRect(0, 0, 1, 1);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    // Start with the default texture
    const [texture, setTexture] = useState(defaultTexture);

    // Load the card image texture and update state when done
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            card.image,
            (loadedTexture) => {
                setTexture(loadedTexture);
            },
            undefined,
            (error) => {
                console.error("Error loading texture:", error);
            }
        );
    }, [card.image]);

    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const hoverAnimationRef = useRef(0);
    const positionRef = useRef(position);

    useEffect(() => {
        positionRef.current = position;
        if (meshRef.current) {
            meshRef.current.position.set(...position);
        }
    }, [position]);

    useFrame(() => {
        if (!meshRef.current) return;
        // Smoothly interpolate the hover animation value
        hoverAnimationRef.current += ((hovered ? 1 : 0) - hoverAnimationRef.current) * 0.15;
        // Update the mesh position while preserving x and z from positionRef
        meshRef.current.position.x = positionRef.current[0];
        meshRef.current.position.y =
            positionRef.current[1] + (hoverAnimationRef.current > 0.001 ? hoverAnimationRef.current * 0.1 : 0);
        meshRef.current.position.z = positionRef.current[2];
    });

    return (
        <mesh
            ref={meshRef}
            position={position} // initial position (will be updated in useFrame)
            rotation={rotation}
            scale={scale}
            onClick={(e) => {
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
                emissive={isPlayable ? new THREE.Color(0xededed) : undefined}
                emissiveIntensity={isMyTurn && isPlayable ? (hovered ? 0.1 : 0.05) : 0}
                color={isMyTurn && !isPlayable ? new THREE.Color(0x888888) : new THREE.Color(0xffffff)}
            />
        </mesh>
    );
};

export default UnoCard3D;
