import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

const City: React.FC = () => {
    const { camera } = useThree();
    
    // Use effect to setup camera and scene once
    useEffect(() => {
        camera.position.set(0, 3.5, 7);
        camera.lookAt(0, 0, 0);
        camera.far = 25;
        camera.near = 0.1;
        camera.updateProjectionMatrix();
    }, []);


    return (
        <>
            {/* Lights */}
            <ambientLight intensity={0.2} />
            <directionalLight
                position={[-10, 30, 5]}
                intensity={1}
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

            <Environment 
                preset="city" 
                background
            />

        </>
    );
};

export default React.memo(City);
