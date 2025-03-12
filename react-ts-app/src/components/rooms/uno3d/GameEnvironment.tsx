import React, { useEffect } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Color } from "three";
import woodTexture from "@assets/img/seemless_wood.webp";
import GrassField from "./GrassField";

const GameEnvironment: React.FC = () => {
    const { camera, scene } = useThree();
    
    
    // Use effect to setup camera and scene once
    useEffect(() => {
        camera.position.set(0, 5, 7);
        camera.lookAt(0, 0, 0);
        camera.far = 200;
        camera.near = 0.1;
        camera.updateProjectionMatrix();
        scene.background = new Color(0x00008b);
    }, []);

    return (
        <>
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

            {/* Table surface */}
            <mesh rotation={[0, 0, 0]} position={[0, -0.2, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[6, 6, 0.2, 32]} />
                <meshStandardMaterial>
                    <primitive attach="map" object={useLoader(TextureLoader, woodTexture)} />
                </meshStandardMaterial>
            </mesh>

            {/* Grass */}
            <GrassField
                planePosition={[0, -3, 0]}
                planeSize={30}
                bladeCount={100000}
                bladeWidth={0.1}
                bladeHeight={0.8}
                bladeHeightVariation={0.6}
             />
        </>
    );
};

export default React.memo(GameEnvironment);
