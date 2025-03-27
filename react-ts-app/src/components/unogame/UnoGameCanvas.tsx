import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Box, IconButton, Tooltip } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Game3DScene from "./Game3DScene.tsx";
import { useUnoGame } from '@hooks/useUnoGame';
import { OrbitControls } from "@react-three/drei";
import MenuManager from "./menus/MenuManager";

// This component will mustly render the ui and various menus as well as the 3d scene
// /!\ NEED the UnoGameProvider to be used in the parent component /!\
const UnoGameCanvas: React.FC = () => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [showPauseMenu, setShowPauseMenu] = useState<boolean>(false);
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);
    const { gameStatus } = useUnoGame();
    
    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (fullscreenContainerRef.current?.requestFullscreen) {
                fullscreenContainerRef.current
                    .requestFullscreen()
                    .then(() => {
                        setIsFullscreen(true);
                    })
                    .catch((err) => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                    });
            }
        } else {
            if (document.exitFullscreen) {
                document
                    .exitFullscreen()
                    .then(() => {
                        setIsFullscreen(false);
                    })
                    .catch((err) => {
                        console.error(`Error attempting to exit fullscreen: ${err.message}`);
                    });
            }
        }
    };

    // Add event listener for fullscreen change
    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const togglePauseMenu = () => {
        if (gameStatus === "in_progress") {
            setShowPauseMenu(prev => !prev);
        }
    };

    return (
        <Box
            ref={fullscreenContainerRef}
            sx={{
                height: isFullscreen ? "100vh" : "500px",
                width: "100%",
                mb: 3,
                borderRadius: isFullscreen ? "0" : "8px",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Canvas shadows dpr={[1, 2]}>
                <Game3DScene/>
                <OrbitControls enableZoom={true} minDistance={3} maxDistance={22} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            {/* Game menus overlay */}
            <MenuManager showPauseMenu={showPauseMenu} setShowPauseMenu={setShowPauseMenu} />

            <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
                <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
                    <IconButton
                        onClick={toggleFullscreen}
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.7)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                            ml: 1,
                        }}
                    >
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                </Tooltip>
            </Box>
            
            {gameStatus === "in_progress" && (
                <Box sx={{ position: "absolute", top: 10, left: 10, zIndex: 100 }}>
                    <Tooltip title={showPauseMenu ? "Resume Game" : "Pause Game"}>
                        <IconButton
                            onClick={togglePauseMenu}
                            sx={{
                                bgcolor: "rgba(255, 255, 255, 0.7)",
                                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                            }}
                        >
                            {showPauseMenu ? <PlayArrowIcon /> : <PauseIcon />}
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
};

export default UnoGameCanvas;
