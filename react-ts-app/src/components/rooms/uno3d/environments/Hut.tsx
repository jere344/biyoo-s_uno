import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Color } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sky, useTexture } from "@react-three/drei";

// Import textures
import woodFloorTexture from "@assets/img/wood_floor_texture.jpg";
import woodPlanksTexture from "@assets/img/wood_planks_texture.jpg";
import woodBeamTexture from "@assets/img/wood_beam_texture.jpg";
import rugTexture from "@assets/img/rug_texture.jpg";
import roofTilesTexture from "@assets/img/roof_tiles_texture.jpg";
import windowGlassTexture from "@assets/img/window_glass_texture.jpg";

interface HutProps {
    position?: [number, number, number]; // x, y, z coordinates
    showLightHelpers?: boolean; // Option to toggle light helpers
}

const Hut: React.FC<HutProps> = ({ position = [0, -4.1, 0] }) => {
    const { camera, scene } = useThree();
    const lanternLightRef = useRef<THREE.PointLight>(null);
    const lanternMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

    // Load all textures
    const textures = useTexture({
        floor: woodFloorTexture,
        walls: woodPlanksTexture,
        beams: woodBeamTexture,
        rug: rugTexture,
        roof: roofTilesTexture,
        glass: windowGlassTexture,
    });

    // Configure textures
    useEffect(() => {
        // Set texture repeat and wrap properties
        Object.values(textures).forEach((texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.needsUpdate = true;
        });

        // Special configurations for certain textures
        textures.floor.repeat.set(4, 4);
        textures.walls.repeat.set(2, 2);
        textures.rug.repeat.set(2, 2);
        textures.glass.repeat.set(1, 1);
		textures.roof.repeat.set(4, 4);

        // Calculate camera position relative to the hut position
        const [x, y, z] = position;
        camera.position.set(x, y + 6.8, z + 12);
        camera.lookAt(x, y + 6, z);
        camera.far = 100;
        camera.near = 0.4;
        camera.updateProjectionMatrix();
        scene.background = new Color(0x3f2a14);
    }, [camera, scene, position, textures]);

    // Animate lantern light with more noise
    useFrame((state) => {
        if (lanternLightRef.current && lanternMaterialRef.current) {
            const time = state.clock.getElapsedTime();
            // Base oscillation
            const mainOscillation = Math.sin(time * 3) * 40;
            // Add faster, smaller oscillation for flicker effect
            const fastFlicker = Math.sin(time * 15) * 15;
            // Add very fast, subtle oscillation for micro-flickers
            const microFlicker = Math.sin(time * 30) * 8;
            // Random noise component (small and occasional)
            const randomNoise = Math.random() > 0.8 ? Math.random() * 20 - 10 : 0;
            
            // Combine all components for light intensity
            const lightIntensity = 100 + mainOscillation + fastFlicker + microFlicker + randomNoise;
            lanternLightRef.current.intensity = lightIntensity;
            
            // Calculate emissive intensity based on the same flicker pattern but scaled down
            // Map from light range (roughly 60-140) to emissive range (0.3-0.7)
            const emissiveIntensity = 0.3 + ((lightIntensity - 60) / 80) * 0.4;
            lanternMaterialRef.current.emissiveIntensity = emissiveIntensity;
        }
    });

    return (
        <group position={position}>
            {/* Night Sky */}
            <Sky
                distance={450000}
                sunPosition={[0, -1, 0]} // Sun below horizon for night
                turbidity={10}
                rayleigh={0.5}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
                inclination={0.49}
                azimuth={0.25}
            />

			<ambientLight intensity={0.2} />

            {/* Visible lantern object */}
            <group position={[0, 10, 0]}>
                <mesh >
                    <sphereGeometry args={[0.6, 16, 16]} />
                    <meshStandardMaterial 
                        ref={lanternMaterialRef}
                        color="rgb(19, 14, 2)" 
                        emissive="rgb(255, 226, 132)" 
                        emissiveIntensity={0.5} 
                    />
                </mesh>
                <mesh position={[0, 3, 0]} >
                    <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
                    <meshStandardMaterial color=" #5D4037" />
                </mesh>
            </group>
			{/* Main light from the center of the lantern, and 360degres light */}
			<pointLight 
                ref={lanternLightRef}
                position={[0, 10, 0]} 
                intensity={100} 
                castShadow 
				color="#FFC107" 
            />

			{/* very short range to light player's hand */}
            <pointLight 
				position={[0, 8, 8]} 
				intensity={30} 
				distance={7}
				/>
            {/* Visible light source for directional light */}
            <mesh position={[-20, 8, 2]} castShadow>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#FFEB3B" emissive="#FFC107" emissiveIntensity={1.5} />
            </mesh>

            {/* Wooden Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[32, 32]} />
                <meshStandardMaterial
                    map={textures.floor}
                    roughness={0.9}
                    metalness={0.1}
                    normalScale={[0.6, 0.6]}
                    aoMapIntensity={1}
                    displacementScale={0.05}
                />
            </mesh>

            {/* Round Rug */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
                <circleGeometry args={[10, 32]} />
                <meshStandardMaterial map={textures.rug} roughness={1} metalness={0} color="#a04040" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]} receiveShadow>
                <ringGeometry args={[8, 9.5, 32]} />
                <meshStandardMaterial map={textures.rug} color="#704000" roughness={1} metalness={0} />
            </mesh>

            {/* Walls */}
            {/* Back Wall */}
            <mesh position={[0, 16, 16]} castShadow receiveShadow>
                <boxGeometry args={[32, 32, 0.8]} />
                <meshStandardMaterial map={textures.walls} roughness={0.8} normalScale={[0.5, 0.5]} displacementScale={0.1} />
            </mesh>

            {/* Front Wall */}
            <mesh position={[0, 16, -16]} receiveShadow >
                <boxGeometry args={[32, 32, 0.8]} />
                <meshStandardMaterial map={textures.walls} roughness={0.8} normalScale={[0.5, 0.5]} displacementScale={0.1} />
            </mesh>

            {/* Left Wall with Window Opening */}
            <group position={[-16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                {/* Bottom section of wall */}
                <mesh position={[0, 4, 0]} receiveShadow>
                    <boxGeometry args={[32, 8, 0.8]} />
                    <meshStandardMaterial map={textures.walls} roughness={0.8} normalScale={[0.5, 0.5]} displacementScale={0.1} />
                </mesh>

                {/* Top section of wall */}
                <mesh position={[0, 16, 0]}  receiveShadow>
                    <boxGeometry args={[32, 8, 0.8]} />
                    <meshStandardMaterial map={textures.walls} roughness={0.8} normalScale={[0.5, 0.5]} displacementScale={0.1} />
                </mesh>

                {/* Left section of wall */}
                <mesh position={[-8, 12, 0]}  receiveShadow>
                    <boxGeometry args={[16, 8, 0.8]} />
                    <meshStandardMaterial map={textures.walls} roughness={0.8} normalScale={[0.5, 0.5]} displacementScale={0.1} />
                </mesh>

                {/* Right section of wall */}
                <mesh position={[12, 12, 0]}  receiveShadow>
                    <boxGeometry args={[8, 8, 0.8]} />
                    <meshStandardMaterial map={textures.walls} roughness={0.8} normalScale={[0.5, 0.5]} displacementScale={0.1} />
                </mesh>

                {/* Window Frame */}
                <group position={[4, 8, 0]}>
                    {/* Window Glass */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[8, 8, 0.2]} />
                        <meshStandardMaterial
                            map={textures.glass}
                            color="#87ceeb"
                            transparent
                            opacity={0.6}
                            roughness={0.2}
                            metalness={0.8}
                        />
                    </mesh>

                    {/* Window Frame - Horizontal Pieces */}
                    <mesh position={[0, 4.1, 0]} castShadow>
                        <boxGeometry args={[8.4, 0.4, 0.4]} />
                        <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} />
                    </mesh>
                    <mesh position={[0, -4.1, 0]} castShadow>
                        <boxGeometry args={[8.4, 0.4, 0.4]} />
                        <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} />
                    </mesh>

                    {/* Window Frame - Vertical Pieces */}
                    <mesh position={[4.1, 0, 0]} castShadow>
                        <boxGeometry args={[0.4, 8.4, 0.4]} />
                        <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} />
                    </mesh>
                    <mesh position={[-4.1, 0, 0]} castShadow>
                        <boxGeometry args={[0.4, 8.4, 0.4]} />
                        <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} />
                    </mesh>

                    {/* Window Center Cross */}
                    <mesh position={[0, 0, 0.05]} castShadow>
                        <boxGeometry args={[0.4, 8, 0.3]} />
                        <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0, 0.05]} castShadow>
                        <boxGeometry args={[8, 0.4, 0.3]} />
                        <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} />
                    </mesh>
                </group>
            </group>

            {/* Right Wall */}
            <group position={[16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh position={[0, 8, 0]} receiveShadow>
                    <boxGeometry args={[32, 16, 0.8]} />
                    <meshStandardMaterial map={textures.walls} roughness={0.8} normalScale={[0.5, 0.5]} displacementScale={0.1} />
                </mesh>
            </group>

            {/* Sloped Roof */}
            <group>
                <mesh position={[-8, 20, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
                    <boxGeometry args={[23, 0.8, 34]} />
                    <meshStandardMaterial
                        map={textures.roof}
                        color="#8b4513"
                        roughness={0.9}
                        normalScale={[0.7, 0.7]}
                        displacementScale={0.2}
                    />
                </mesh>
                <mesh position={[8, 20, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
                    <boxGeometry args={[23, 0.8, 34]} />
                    <meshStandardMaterial
                        map={textures.roof}
                        color="#8b4513"
                        roughness={0.9}
                        normalScale={[0.7, 0.7]}
                        displacementScale={0.2}
                    />
                </mesh>
            </group>

            {/* Wooden beams */}
            <mesh position={[0, 16, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[34, 1.2, 1.2]} />
                <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} displacementScale={0.05} />
            </mesh>
            <mesh position={[0, 15.2, 8]} castShadow>
                <boxGeometry args={[34, 1.2, 1.2]} />
                <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} displacementScale={0.05} />
            </mesh>
            <mesh position={[0, 15.2, -8]} castShadow>
                <boxGeometry args={[34, 1.2, 1.2]} />
                <meshStandardMaterial map={textures.beams} color="#6b4226" roughness={0.7} displacementScale={0.05} />
            </mesh>

            {/* Wooden table in the center */}
            <mesh position={[0, 4, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[6, 6, 0.2, 128]} />
                <meshStandardMaterial map={textures.floor} color="#8b4513" roughness={0.9} normalScale={[0.4, 0.4]} />
            </mesh>
            <mesh position={[0, 2, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[0.8, 0.8, 4, 16]} />
                <meshStandardMaterial map={textures.beams} color="#8b4513" roughness={0.9} />
            </mesh>

            {/* Wooden Stools */}
            {/* Stool 1 */}
            <mesh position={[-6, 2, 6]} receiveShadow castShadow>
                <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
                <meshStandardMaterial map={textures.floor} color="#a0522d" roughness={0.9} />
            </mesh>
            <mesh position={[-6, 1, 6]} receiveShadow castShadow>
                <cylinderGeometry args={[0.4, 0.4, 2, 16]} />
                <meshStandardMaterial map={textures.floor} color="#a0522d" roughness={0.9} />
            </mesh>

            {/* Stool 2 */}
            <mesh position={[6, 2, -6]} receiveShadow castShadow>
                <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
                <meshStandardMaterial map={textures.floor} color="#a0522d" roughness={0.9} />
            </mesh>
            <mesh position={[6, 1, -6]} receiveShadow castShadow>
                <cylinderGeometry args={[0.4, 0.4, 2, 16]} />
                <meshStandardMaterial map={textures.floor} color="#a0522d" roughness={0.9} />
            </mesh>

            {/* Stool 3 */}
            <mesh position={[6, 2, 6]} receiveShadow castShadow>
                <cylinderGeometry args={[1.2, 1.2, 0.2, 16]} />
                <meshStandardMaterial map={textures.floor} color="#a0522d" roughness={0.9} />
            </mesh>
            <mesh position={[6, 1, 6]} receiveShadow castShadow>
                <cylinderGeometry args={[0.4, 0.4, 2, 16]} />
                <meshStandardMaterial map={textures.floor} color="#a0522d" roughness={0.9} />
            </mesh>
        </group>
    );
};

export default React.memo(Hut);
