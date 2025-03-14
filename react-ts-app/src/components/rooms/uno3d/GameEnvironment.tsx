import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Color } from "three";
import GrassField from "./GrassField";
import { Sky } from "@react-three/drei";

const GameEnvironment: React.FC = () => {
    const { camera, scene } = useThree();
    
    // Use effect to setup camera and scene once
    useEffect(() => {
        camera.position.set(0, 3.5, 7);
        camera.lookAt(0, 0, 0);
        camera.far = 25;
        camera.near = 0.1;
        camera.updateProjectionMatrix();
        scene.background = new Color(0x00008b);
    }, []);


    return (
        <>
            {/* Skybox */}
            <Sky sunPosition={[100, 10, 100]} turbidity={10} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.8} distance={400} inclination={0.49} azimuth={0.25} />
            
            {/* Lights */}
            <ambientLight intensity={0.7} />
            <directionalLight
                position={[-10, 30, 5]}
                intensity={1.5}
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
                    color="#a0d8ef"
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
             />
        </>
    );
};

export default React.memo(GameEnvironment);
