import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Color, FogExp2 } from "three";
import GrassField from "./GrassField";
import { Sky } from "@react-three/drei";

const AutumnGrassEnvironment: React.FC = () => {
    const { camera, scene } = useThree();
    
    // Use effect to setup camera and scene once
    useEffect(() => {
        camera.position.set(0, 3.5, 7);
        camera.lookAt(0, 0, 0);
        camera.far = 25;
        camera.near = 0.1;
        camera.updateProjectionMatrix();
        
        // Add darker, evening-colored fog for autumn dusk atmosphere
        scene.fog = new FogExp2(0xc27b58, 0.045);
    }, []);


    return (
        <>
            {/* Evening autumn-themed Skybox */}
            <Sky 
                sunPosition={[20, 5, 100]} 
                turbidity={8} 
                rayleigh={6} 
                mieCoefficient={0.002} 
                mieDirectionalG={0.8} 
                distance={450} 
                inclination={0.3} 
                azimuth={0.25} 
            />
            
            {/* Evening lights - warmer and softer for autumn sunset */}
            <ambientLight intensity={0.5} color="#e8b27d" />
            <directionalLight
                position={[-10, 30, 5]}
                intensity={1.5}
                color="rgb(248, 232, 204)"
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            {/* Glass table surface */}
            <mesh rotation={[0, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
                <cylinderGeometry args={[6, 6, 0.2, 128]} />
                <meshPhysicalMaterial 
                    transparent={true}
                    opacity={0.6}
                    roughness={0.1}
                    thickness={0}
                    color="#bd8e65"
                    metalness={0.3}
                />
            </mesh>

            {/* Grass */}
            <GrassField
                planePosition={[0, -2, 0]}
                planeSize={30}
                bladeCount={50000}
                bladeWidth={0.5}
                bladeHeight={0.8}
                bladeHeightVariation={0.3}
                type="autumn"
             />
        </>
    );
};

export default React.memo(AutumnGrassEnvironment);
