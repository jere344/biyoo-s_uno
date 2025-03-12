import React, { useEffect } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { Color } from "three";
import woodTexture from "@assets/img/seemless_wood.webp";
import grassTexture from "@assets/img/grass_texture.jpg";

const GameEnvironment: React.FC = () => {
    const { camera, scene } = useThree();
    
    // Load the grass texture with repeat settings
    const grassTextureMap = useLoader(TextureLoader, grassTexture);
    grassTextureMap.wrapS = RepeatWrapping;
    grassTextureMap.wrapT = RepeatWrapping;
    grassTextureMap.repeat.set(100, 100);
    
    // Use effect to setup camera and scene once
    useEffect(() => {
        console.log("GameEnvironment rendered");
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

            {/* Grass ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
                <planeGeometry args={[600, 600]} />
                <meshStandardMaterial map={grassTextureMap} />
            </mesh>
        </>
    );
};

export default React.memo(GameEnvironment);
