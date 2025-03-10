import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import IUnoGame from "../../../data_interfaces/IUnoGame";
import IUnoPlayer from "../../../data_interfaces/IUnoPlayer";
import UnoCard3D from "./UnoCard3D";
import DrawPile from "./DrawPile";
import { Color, RepeatWrapping } from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import woodTexture from "@assets/img/seemless_wood.webp";
import grassTexture from "@assets/img/grass_texture.jpg";

interface Game3DSceneProps {
    gameState: IUnoGame;
    myPlayer: IUnoPlayer | null;
    isMyTurn: boolean;
    onPlayCard: (cardId: number) => void;
    onDrawCard: () => void;
}

const Game3DScene: React.FC<Game3DSceneProps> = ({ gameState, myPlayer, isMyTurn, onPlayCard, onDrawCard }) => {
    const { camera, scene } = useThree();

    // Setup initial camera position and background color
    useMemo(() => {
        camera.position.set(0, 5, 7);
        camera.lookAt(0, 0, 0);
        camera.far = 200; // Set how far the camera can see
        camera.near = 0.1; // Set how close the camera can see
        camera.updateProjectionMatrix(); // Required after changing camera properties
        scene.background = new Color(0x00008b);
    }, [camera, scene]);

    // Load and configure the grass texture
    const grassTextureMap = useLoader(TextureLoader, grassTexture);
    useMemo(() => {
        grassTextureMap.wrapS = RepeatWrapping;
        grassTextureMap.wrapT = RepeatWrapping;
        grassTextureMap.repeat.set(30, 30); // Repeat the texture 10 times in each direction
    }, [grassTextureMap]);

    // Handle player's hand layout
    const renderPlayerHand = () => {
        if (!myPlayer?.hand?.length) return null;

        const cardWidth = 1;
        const totalWidth = myPlayer.hand.length * cardWidth;
        const startX = -totalWidth / 2 + cardWidth / 2;
        const superpose_offset = 0.01;

        return myPlayer.hand.map((card, index) => {
            const x = startX + index * cardWidth;
            const isPlayable = isMyTurn && card.can_play;

            return (
                <UnoCard3D
                    key={card.id}
                    card={card}
                    position={[x, 0.7, 4.5 + superpose_offset * index]}
                    rotation={[-0.7, 0, 0]}
                    onClick={() => onPlayCard(card.id)}
                    isPlayable={isPlayable}
                    highlight={isPlayable}
                />
            );
        });
    };

    // Render other players' hands
    const renderOtherPlayersHands = () => {
        if (!gameState.players || !myPlayer) return null;

        const tableRadius = 4; // Distance from center of table
        const otherPlayers = gameState.players.filter((player) => player.id !== myPlayer.id);

        // Calculate positions around the table
        return otherPlayers.map((player, index) => {
            index = index + 0.5;
            const angleStep = (2 * Math.PI) / otherPlayers.length;
            const angle = angleStep * index;

            // Position calculation (on a circle around the table)
            const x = tableRadius * Math.sin(angle);
            const z = tableRadius * Math.cos(angle);

            // Rotation to face center of table
            const rotationY = Math.PI + angle;

            // If player has no cards, skip rendering
            if (!player.hand || player.hand <= 0) return null;

            // Render the player's name
            const nameElement = (
                <Text
                    key={`name-${player.id}`}
                    position={[x, 1.5, z]}
                    rotation={[0, rotationY, 0]}
                    color="white"
                    fontSize={0.5}
                    outlineWidth={0.05}
                    outlineColor="black"
                    anchorX="center"
                    anchorY="bottom"
                >
                    {player.name} ({player.hand} cards)
                </Text>
            );

            // Render the player's cards
            const cardWidth = 0.7; // Smaller than player's cards
            const cardsPerRow = Math.min(7, player.hand);

            const cards = Array.from({ length: player.hand }).map((_, cardIndex) => {
                const row = Math.floor(cardIndex / cardsPerRow);
                const col = cardIndex % cardsPerRow;

                const totalWidth = Math.min(player.hand, cardsPerRow) * cardWidth;
                const startX = -totalWidth / 2 + cardWidth / 2;

                const cardX = startX + col * cardWidth;
                const cardZ = 0.3 * row;

                // Create a dummy card object with the back image
                const dummyCard = {
                    id: -1 * (player.id * 1000 + cardIndex), // Unique negative ID
                    image: player.card_back?.image || gameState.card_back?.image,
                    color: "",
                    value: "",
                    can_play: false,
                };

                return (
                    <UnoCard3D
                        key={`card-${player.id}-${cardIndex}`}
                        card={dummyCard}
                        position={[
                            x + cardX * Math.cos(rotationY),
                            0.7 - 0.1 * row,
                            z + cardX * Math.sin(rotationY) + cardZ * Math.cos(rotationY),
                        ]}
                        rotation={[0, rotationY, 0]}
                        scale={[0.7, 0.7, 0.1]}
                    />
                );
            });

            return [nameElement, ...cards];
        });
    };

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

            {/* Current card in play */}
            {gameState.current_card && (
                <UnoCard3D
                    card={gameState.current_card}
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[1.5, 1.5, 0.1]}
                />
            )}

            {/* Draw pile */}
            <DrawPile
                cardBack={gameState.card_back}
                position={[-2.5, 0, 1]}
                onClick={onDrawCard}
                isPlayable={isMyTurn}
            />

            {/* Player's hand */}
            {renderPlayerHand()}

            {/* Other players' hands */}
            {renderOtherPlayersHands()}

            {/* Game direction indicator */}
            <Text position={[0, 0.5, -2]} color="white" fontSize={1.5} outlineWidth={0.05} outlineColor="black">
                {gameState.direction === true ? "→" : "←"}
            </Text>

            {/* Table surface */}
            <mesh rotation={[0, 0, 0]} position={[0, -0.2, 0]} receiveShadow castShadow>
                <cylinderGeometry args={[6, 6, 0.2, 32]} />
                <meshStandardMaterial>
                    <primitive attach="map" object={useLoader(TextureLoader, woodTexture)} />
                </meshStandardMaterial>
            </mesh>

            {/* Grass ground - using expanded plane and repeated texture */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
                <planeGeometry args={[600, 600]} /> {/* Much larger plane */}
                <meshStandardMaterial map={grassTextureMap} />
            </mesh>

            <OrbitControls
                enableZoom={true}
                minDistance={3}
                maxDistance={12}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
};

export default Game3DScene;
