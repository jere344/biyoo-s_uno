import React, { useEffect } from "react";
import { useUnoGame } from "@hooks/useUnoGame";
import ConnectionMenu from "./ConnectionMenu";
import LobbyMenu from "./LobbyMenu";
import GameMenu from "./GameMenu";
import GameOverMenu from "./GameOverMenu";

interface MenuManagerProps {
    showPauseMenu: boolean;
    setShowPauseMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuManager: React.FC<MenuManagerProps> = ({ showPauseMenu, setShowPauseMenu }) => {
    const { soundManager, gameStatus } = useUnoGame();

    // Handle escape key for pause menu
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && gameStatus === "in_progress") {
                setShowPauseMenu((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameStatus, setShowPauseMenu]);

    // Handle music based on game state and pause menu
    useEffect(() => {
        if (gameStatus === "in_progress" && !showPauseMenu) {
            soundManager.playMusic();
        } else {
            soundManager.pauseMusic();
        }
    }, [gameStatus, showPauseMenu, soundManager]);

    // Different menus based on game state
    if (gameStatus === "disconnected") {
        return <ConnectionMenu />;
    }
    if (showPauseMenu && gameStatus === "in_progress") {
        return <GameMenu onClose={() => setShowPauseMenu(false)} />;
    }
    if (gameStatus === "waiting_for_players") {
        return <LobbyMenu />;
    }
    if (gameStatus === "game_over") {
        return <GameOverMenu />;
    }
    return null;
};

export default MenuManager;
