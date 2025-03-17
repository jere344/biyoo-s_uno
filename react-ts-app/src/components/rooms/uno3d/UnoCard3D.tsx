import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import IUnoCard from "../../../data_interfaces/IUnoCard";

interface UnoCard3DProps {
    card: IUnoCard;
    cardBack?: IUnoCard;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    onClick?: () => void;
    isPlayable?: boolean;
    isMyTurn?: boolean;

    // for animation
    originalPosition?: [number, number, number] | null;
    originalRotation?: [number, number, number] | null;
    originalScale?: [number, number, number] | null;
    animationDuration?: number | null;
    onAnimationComplete?: (() => void) | null;
}

const UnoCard3D: React.FC<UnoCard3DProps> = ({
    card,
    cardBack=null,
    position,
    rotation = [0, 0, 0],
    scale = [1, 1, 0.1],
    onClick,
    isPlayable = false,
    isMyTurn = false,
    originalPosition = null,
    originalRotation = null,
    originalScale = null,
    animationDuration = null,
    onAnimationComplete = null,
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
    const [cardBackTexture, setCardBackTexture] = useState(defaultTexture);

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
        if (cardBack?.image){
            loader.load(
                cardBack?.image || "",
                (loadedTexture) => {
                    setCardBackTexture(loadedTexture);
                },
                undefined,
                (error) => {
                    console.error("Error loading texture:", error);
                }
            );
        }
    }, [card.image, cardBack?.image]);

    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const hoverAnimationRef = useRef(0);
    const positionRef = useRef(position);
    const rotationRef = useRef(rotation);
    const scaleRef = useRef(scale);

    useEffect(() => {
        positionRef.current = position;
        rotationRef.current = rotation;
        scaleRef.current = scale;
        if (meshRef.current) {
            meshRef.current.position.set(...position);
            meshRef.current.rotation.set(...rotation);
            meshRef.current.scale.set(...scale);
        }
    }, [position, rotation, scale]);

    const time = useRef(new THREE.Clock());
    const [animationComplete, setAnimationComplete] = useState(false);

    const easeInOutQuad = (t: number) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    useFrame(() => {
        if (!meshRef.current) return;
        // Smoothly interpolate the hover animation value
        hoverAnimationRef.current += ((hovered ? 1 : 0) - hoverAnimationRef.current) * 0.3;
        // Update the mesh position while preserving x and z from positionRef
        meshRef.current.position.x = positionRef.current[0];
        meshRef.current.position.y =
            positionRef.current[1] + (hoverAnimationRef.current > 0.001 ? hoverAnimationRef.current * 0.1 : 0);
        meshRef.current.position.z = positionRef.current[2];


        // If an animation has been requested, animate the card
        if (!animationComplete && (originalPosition || originalRotation || originalScale)) {
            // if the animation has not started yet, start it
            if (!time.current.running) {
                time.current.start();
            }
            // calculate the progress of the animation
            const progress = easeInOutQuad(Math.min(1, time.current.getElapsedTime() / (animationDuration ?? 1)));

            
            // update the position
            if (originalPosition) {
                meshRef.current.position.x = originalPosition[0] + (position[0] - originalPosition[0]) * progress;
                meshRef.current.position.y = originalPosition[1] + (position[1] - originalPosition[1]) * progress;
                meshRef.current.position.z = originalPosition[2] + (position[2] - originalPosition[2]) * progress;
            }
            // update the rotation
            if (originalRotation) {
                meshRef.current.rotation.x = originalRotation[0] + (rotation[0] - originalRotation[0]) * progress;
                meshRef.current.rotation.y = originalRotation[1] + (rotation[1] - originalRotation[1]) * progress;
                meshRef.current.rotation.z = originalRotation[2] + (rotation[2] - originalRotation[2]) * progress;
            }
            // update the scale
            if (originalScale) {
                meshRef.current.scale.x = originalScale[0] + (scale[0] - originalScale[0]) * progress;
                meshRef.current.scale.y = originalScale[1] + (scale[1] - originalScale[1]) * progress;
                meshRef.current.scale.z = originalScale[2] + (scale[2] - originalScale[2]) * progress;
            }
            // if the animation is complete, stop the animation
            if (progress >= 1) {
                time.current.stop();
                setAnimationComplete(true);
                if (onAnimationComplete) onAnimationComplete();
            }
        }
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
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true)
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                setHovered(false)
            }}
            castShadow
        >
            <boxGeometry args={[1, 1.5, 0.05]} />
                
            <meshStandardMaterial attach="material-0" color={0xffffff} />
            <meshStandardMaterial attach="material-1" color={0xffffff} />
            <meshStandardMaterial attach="material-2" color={0xffffff} />
            <meshStandardMaterial attach="material-3" color={0xffffff} />
            <meshStandardMaterial
                attach="material-4"
                map={texture} // front face
                emissive={isPlayable ? new THREE.Color(0xededed) : undefined}
                emissiveIntensity={isMyTurn && isPlayable ? (hovered ? 0.1 : 0.05) : 0}
                color={isMyTurn && !isPlayable ? new THREE.Color(0x888888) : new THREE.Color(0xffffff)}
            />
            <meshStandardMaterial
                attach="material-5"
                map={cardBackTexture} // back face
            />
        </mesh>
    );
};

export default UnoCard3D;
