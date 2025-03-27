import React, { createContext, useEffect, useState, useRef } from "react";
import { UnoGameWebsocketDS } from "../data_services/websockets/UnoGameWebsocketDS";
import IUnoGame from "@DI/IUnoGame";
import IUnoPlayer from "@DI/IUnoPlayer";
import { useUser } from "@hooks/useUser";
import { SoundManager } from "../utils/SoundManager";

// Define the context type
interface UnoGameContextType {
    wsService: UnoGameWebsocketDS | null;
    // Current game state
    gameState: IUnoGame | null;
    connectionStatus: "connected" | "disconnected" | "connecting";
    error: string | null;
    connectedCount: number;

    // Last game state (for comparisons/transitions)
    lastGameState: IUnoGame | null;

    // Rerender-safe storage
    storage: Record<string, any>;
    setStorageItem: (key: string, value: any) => void;

    // Utilities and pre-computed values
    myPlayer: IUnoPlayer | undefined;
    isMyTurn: boolean;
    gameStatus: "waiting_for_players" | "in_progress" | "game_over" | "disconnected";

    // Sound management
    soundManager: SoundManager;

    // Game actions
    startGame: () => void;
    restartGame: () => void;
    stopGame: () => void;
    playCard: (cardId: number, color?: string) => void;
    drawCard: () => void;
    sayUno: () => void;
    denyUno: (playerId: number) => void;
}

// Create the context
export const UnoGameContext = createContext<UnoGameContextType | null>(null);

// Provider props
interface UnoGameProviderProps {
    roomId: number;
    token: string;
    children: React.ReactNode;
    userId?: number; // Optional user ID to determine if it's the player's turn
}

export const UnoGameProvider: React.FC<UnoGameProviderProps> = ({ roomId, token, children }) => {
    const { user } = useUser(); // Get the user ID from the context
    // Initialize the WebSocket service
    const wsService = useRef<UnoGameWebsocketDS | null>(null);
    
    // Initialize the Sound Manager
    const soundManagerRef = useRef<SoundManager>(new SoundManager());

    // Game state from WebSocket
    const [gameState, setGameState] = useState<IUnoGame | null>(null);
    const [lastGameState, setLastGameState] = useState<IUnoGame | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected");
    const [error, setError] = useState<string | null>(null);
    const [connectedCount, setConnectedCount] = useState<number>(0);

    // Rerender-safe storage for sound effects, animations, etc.
    const [storage, setStorage] = useState<Record<string, any>>({});

    // Set a single storage item without causing unnecessary rerenders
    const setStorageItem = (key: string, value: any) => {
        setStorage((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Initialize WebSocket connection
    useEffect(() => {
        wsService.current = new UnoGameWebsocketDS(roomId, token);

        // Subscribe to observables
        const gameStateSub = wsService.current.gameState$.subscribe((state) => {
            setLastGameState(gameState);
            setGameState(state);
        });

        const connectionSub = wsService.current.connectionStatus$.subscribe(setConnectionStatus);
        const errorSub = wsService.current.error$.subscribe(setError);
        const connectedCountSub = wsService.current.connectedCount$.subscribe(setConnectedCount);

        // Connect to WebSocket
        wsService.current.connect();

        // Cleanup
        return () => {
            gameStateSub.unsubscribe();
            connectionSub.unsubscribe();
            errorSub.unsubscribe();
            connectedCountSub.unsubscribe();
            wsService.current?.disconnect();
            soundManagerRef.current.stopMusic();
        };
    }, [roomId, token]);
    const getGameStatus = () => {
        if (connectionStatus !== "connected") {
            return "disconnected";
        }
        if (!gameState) {
            return "waiting_for_players";
        }
        if (gameState.winner) {
            return "game_over";
        }
        return "in_progress";
    };


    const myPlayer = gameState?.players.find((player) => player.user.id === user?.id);
    const isMyTurn = gameState?.current_player_number === myPlayer?.player_number;
    const gameStatus = getGameStatus();
    

    // Game actions
    const startGame = () => wsService.current?.startGame();
    const restartGame = () => wsService.current?.restartGame();
    const stopGame = () => wsService.current?.stopGame();
    const playCard = (cardId: number, color?: string) => {
        wsService.current?.playCard(cardId, color);
    };
    const drawCard = () => wsService.current?.drawCard();
    const sayUno = () => wsService.current?.sayUno();
    const denyUno = (playerId: number) => wsService.current?.denyUno(playerId);

    // Context value
    const value: UnoGameContextType = {
        wsService: wsService.current,
        // Current state
        gameState,
        connectionStatus,
        error,
        connectedCount,

        // Last state
        lastGameState,

        // Storage
        storage,
        setStorageItem,

        // Utilities
        myPlayer,
        isMyTurn,
        gameStatus,

        // Sound management
        soundManager: soundManagerRef.current,

        // Actions
        startGame,
        restartGame,
        stopGame,
        playCard,
        drawCard,
        sayUno,
        denyUno,
    };

    return <UnoGameContext.Provider value={value}>{children}</UnoGameContext.Provider>;
};
