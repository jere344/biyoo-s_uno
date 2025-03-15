import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Button, Alert, Snackbar, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { UnoGameWebsocketDS } from "../../data_services/websockets/UnoGameWebsocketDS";
import { useParams } from "react-router-dom";
import { storageUsernameKey, storageAccessTokenKey } from "../../data_services/CustomAxios";
// import UnoGameBoard from "./UnoGameBoard";
import UnoGameBoard3d from "./uno3d/UnoGameBoard3d";
import { motion, AnimatePresence } from "framer-motion";
import CasinoIcon from '@mui/icons-material/Casino';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { useUser } from "../../hooks/useUser";

// UNO card colors
const UNO_COLORS = {
  red: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
  blue: "linear-gradient(135deg, #12c2e9 0%, #0052d4 100%)",
  green: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
  yellow: "linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)",
  wild: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
};

export default function UnoGame() {
    const { user } = useUser();
    const { id } = useParams(); // room id from route params
    const roomId = parseInt(id as string, 10);
    const [gameService, setGameService] = useState<UnoGameWebsocketDS | null>(null);
    const [gameState, setGameState] = useState<UnoGame | null>(null);
    const [gamePlayerCount, setGamePlayerCount] = useState<number>(0);
    const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">(
        "disconnected"
    );
    const [error, setError] = useState<string | null>(null);
    
    // Color selection state
    const [colorSelectionOpen, setColorSelectionOpen] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

    // Add a new state to track if we're ready to connect
    const [isReadyToConnect, setIsReadyToConnect] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem(storageAccessTokenKey);
        const username = localStorage.getItem(storageUsernameKey);
        
        if (token && username && roomId) {
            const service = new UnoGameWebsocketDS(roomId, token);
            setGameService(service);
            setIsReadyToConnect(true);
        }
        
        return () => {
            if (gameService) {
                gameService.disconnect();
            }
        };
    }, [roomId]);

    // Handle WebSocket connection separately
    useEffect(() => {
        if (!gameService || !isReadyToConnect) {
            return;
        }

        const gameSubscription = gameService.gameState$.subscribe((state) => {
            setGameState(state);
        });

        const gamePlayerCountSubscription = gameService.playerCount$.subscribe((count) => {
            setGamePlayerCount(count);
        });

        const connectionSubscription = gameService.connectionStatus$.subscribe((status) => {
            setConnectionStatus(status);
        });

        const errorSubscription = gameService.error$.subscribe((err) => {
            if (err) setError(err);
        });

        // Connect to the WebSocket only when we're ready
        gameService.connect();

        return () => {
            gameSubscription.unsubscribe();
            gamePlayerCountSubscription.unsubscribe();
            connectionSubscription.unsubscribe();
            errorSubscription.unsubscribe();
            gameService.disconnect();
        };
    }, [gameService, isReadyToConnect]);

    const getMyPlayer = (): UnoPlayer | null => {
        if (!gameState || !user) return null;
        return gameState.players.find((p) => p.user.id === user?.id ) || null;
    }

    const getCurrentPlayer = (): UnoPlayer | null => {
        if (!gameState) return null;
        return gameState.players.find((p) => p.player_number === gameState.current_player_number) || null;
    };

    const handlePlayCard = (cardId: number) => {
        if (!gameService) return;
        
        // Check if the card requires color selection
        const myPlayer = getMyPlayer();
        if (!myPlayer) return;
        
        const cardToPlay = myPlayer.hand.find(card => card.id === cardId);
        if (!cardToPlay) return;
        
        if (cardToPlay.action.includes("wild")) {
            // Open color selection dialog
            setSelectedCardId(cardId);
            setColorSelectionOpen(true);
        } else {
            // Play card directly
            gameService.playCard(cardId);
        }
    };

    const handleColorSelection = (color: string) => {
        if (gameService && selectedCardId !== null) {
            gameService.playCard(selectedCardId, color);
            setSelectedCardId(null);
        }
        setColorSelectionOpen(false);
    };

    const handleDrawCard = () => {
        if (gameService) {
            gameService.drawCard();
        }
    };

    const handleStartGame = () => {
        if (gameService) {
            gameService.startGame();
        }
    };

    const handleRestartGame = () => {
        if (gameService) {
            gameService.restartGame();
        }
    };

    const handleStopGame = () => {
        if (gameService) {
            gameService.stopGame();
        }
    };

    const handleSayUno = () => {
        if (gameService) {
            gameService.sayUno();
        }
    }

    const handleDenyUno = (playerId: number) => {
        if (gameService) {
            gameService.denyUno(playerId);
        }
    }

    // Loading state with animation
    if (connectionStatus === "connecting") {
        return (
            <Paper 
                elevation={5}
                sx={{ 
                    padding: "3rem", 
                    textAlign: "center",
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Box sx={{ position: "relative" }}>
                    <motion.div
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
                        }}
                    >
                        <Box sx={{ 
                            position: "absolute", 
                            width: "150px", 
                            height: "150px", 
                            borderRadius: "50%", 
                            background: "linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)", 
                            left: "-75px", 
                            top: "-75px",
                            mixBlendMode: "overlay"
                        }} />
                        <SportsEsportsIcon sx={{ fontSize: 80, color: "#ffffff", opacity: 0.9 }} />
                    </motion.div>
                </Box>
                <Typography variant="h5" sx={{ mt: 4, color: "#ffffff", fontWeight: 600, textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                    Connexion au jeu...
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <motion.div
                        animate={{ 
                            x: [-40, 40],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ 
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                    >
                        <Box sx={{ 
                            display: "flex", 
                            gap: "8px"
                        }}>
                            {[...Array(3)].map((_, i) => (
                                <Box key={i} sx={{ 
                                    width: "12px", 
                                    height: "12px", 
                                    borderRadius: "50%", 
                                    backgroundColor: "#ffffff",
                                    opacity: 0.7
                                }} />
                            ))}
                        </Box>
                    </motion.div>
                </Box>
            </Paper>
        );
    }

    // Disconnected state with fancy UI
    if (connectionStatus === "disconnected") {
        return (
            <Paper 
                elevation={5}
                sx={{ 
                    padding: "2rem", 
                    textAlign: "center",
                    background: "linear-gradient(135deg, #485563 0%, #29323c 100%)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "400px",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.05,
                        backgroundImage: "url('/assets/pattern_overlay.png')",
                        zIndex: 0,
                    }}
                />
                
                <Box sx={{ position: "relative", zIndex: 1, py: 4 }}>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box 
                            sx={{ 
                                width: "100px", 
                                height: "100px", 
                                margin: "0 auto",
                                borderRadius: "50%",
                                background: "linear-gradient(to right top, #ff6b6b, #f53b82)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                mb: 3
                            }}
                        >
                            <PriorityHighIcon sx={{ fontSize: 60, color: "#fff" }} />
                        </Box>
                    </motion.div>

                    <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 600, mb: 2, textShadow: "1px 1px 3px rgba(0,0,0,0.3)" }}>
                        Déconnecté du serveur de jeu
                    </Typography>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Box 
                                sx={{ 
                                    backgroundColor: "rgba(255,82,82,0.15)", 
                                    borderLeft: "4px solid #ff5252",
                                    py: 1.5,
                                    px: 2,
                                    mx: "auto",
                                    maxWidth: "400px",
                                    borderRadius: "0 8px 8px 0",
                                    textAlign: "left",
                                    mb: 3
                                }}
                            >
                                <Typography variant="body2" sx={{ color: "#f9f9f9", fontSize: "0.9rem" }}>
                                    {error}
                                </Typography>
                            </Box>
                        </motion.div>
                    )}

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            variant="contained" 
                            onClick={() => window.location.reload()} 
                            sx={{ 
                                mt: 2,
                                background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
                                color: "white",
                                fontWeight: 600,
                                borderRadius: "50px",
                                px: 4,
                                py: 1.5,
                                boxShadow: "0 10px 20px rgba(33, 150, 243, 0.3)",
                                "&:hover": {
                                    boxShadow: "0 15px 25px rgba(33, 150, 243, 0.4)",
                                }
                            }}
                            startIcon={<RefreshIcon />}
                        >
                            Réessayer
                        </Button>
                    </motion.div>
                </Box>
            </Paper>
        );
    }

    // Game not started state
    if (!gameState) {
        return (
            <Paper 
                elevation={5}
                sx={{ 
                    padding: "2.5rem", 
                    position: "relative",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    backgroundImage: "url('https://t3.ftcdn.net/jpg/03/06/59/52/360_F_306595210_sTtKiI1G7Ulo8q3OfAXpKvMrDXOEb8eJ.jpg')",
                    backgroundSize: "cover",
                    backgroundBlendMode: "overlay",
                    borderRadius: "20px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                    minHeight: "600px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box 
                    sx={{ 
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 0,
                        backdropFilter: "blur(5px)",
                    }} 
                />
                
                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%" }}>
                    <motion.div
                        animate={{ 
                            rotateY: [0, 180, 360],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "loop",
                        }}
                        style={{ marginBottom: "1.5rem", perspective: "1000px" }}
                    >
                        <Box sx={{ 
                            width: "150px", 
                            height: "210px", 
                            backgroundColor: "#fff", 
                            borderRadius: "15px", 
                            margin: "0 auto", 
                            position: "relative",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
                            border: "8px solid #fff",
                        }}>
                            <Typography variant="h2" sx={{ 
                                color: "#fff", 
                                fontWeight: "800",
                                fontFamily: "'Arial Black', sans-serif",
                                textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                                transform: "rotate(-25deg)",
                                fontSize: "3.5rem",
                            }}>
                                UNO
                            </Typography>
                        </Box>
                    </motion.div>
                    
                    <Box sx={{ mt: 4, mb: 6 }}>
                        <Typography variant="h4" sx={{ 
                            color: "#ffffff", 
                            fontWeight: 700, 
                            mb: 1,
                            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        }}>
                            Partie non démarrée
                        </Typography>

                        <AnimatePresence>
                            {gamePlayerCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Typography variant="h5" sx={{ 
                                        color: "#4fc3f7", 
                                        mt: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                                    }}>
                                        <PeopleIcon sx={{ fontSize: 30 }} />
                                        {gamePlayerCount} joueur{gamePlayerCount > 1 ? 's' : ''} connecté{gamePlayerCount > 1 ? 's' : ''}
                                    </Typography>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                    
                    {gamePlayerCount > 1 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="contained"
                                onClick={handleStartGame}
                                disabled={gamePlayerCount < 2}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    fontSize: "1.2rem",
                                    borderRadius: "50px",
                                    background: "linear-gradient(45deg, #FF9800 30%, #F57C00 90%)",
                                    color: "white",
                                    fontWeight: 700,
                                    boxShadow: "0 10px 30px rgba(255, 152, 0, 0.4)",
                                    "&:hover": {
                                        background: "linear-gradient(45deg, #F57C00 30%, #FF9800 90%)",
                                        boxShadow: "0 15px 40px rgba(255, 152, 0, 0.5)",
                                    },
                                    "&.Mui-disabled": {
                                        background: "rgba(255, 255, 255, 0.2)",
                                    }
                                }}
                                startIcon={<CasinoIcon sx={{ fontSize: 28 }} />}
                            >
                                Commencer le jeu
                            </Button>
                        </motion.div>
                    )}
                </Box>
            </Paper>
        );
    }

    const myPlayer = getMyPlayer();
    const currentPlayer = getCurrentPlayer();
    const isMyTurn = myPlayer && currentPlayer && myPlayer.user === currentPlayer.user;

    return (
        <Paper
            elevation={5}
            sx={{
                padding: "1rem",
                minHeight: "800px",
                background: "linear-gradient(135deg, #003366 0%, #1a237e 100%)",
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
            }}
        >
            {/* Background pattern */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    backgroundImage: "url('/assets/pattern_overlay.png')",
                    zIndex: 0,
                }}
            />

            {/* Error message */}
            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{ 
                        width: '100%',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        borderRadius: '10px',
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                        }
                    }}
                    variant="filled"
                >
                    {error}
                </Alert>
            </Snackbar>

            {/* Color Selection Dialog */}
            <Dialog 
                open={colorSelectionOpen} 
                onClose={() => setColorSelectionOpen(false)}
                PaperProps={{
                    style: {
                        borderRadius: '20px',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #1a2a6c 0%, #2a3e84 100%)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#fff', textAlign: 'center', fontWeight: 700, fontSize: '1.5rem' }}>
                    Choisir une couleur
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        {["red", "blue", "green", "yellow"].map(color => (
                            <motion.div 
                                key={color} 
                                whileHover={{ scale: 1.1, rotate: 5 }} 
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button 
                                    variant="contained" 
                                    onClick={() => handleColorSelection(color)}
                                    sx={{ 
                                        background: UNO_COLORS[color as keyof typeof UNO_COLORS], 
                                        minWidth: '80px', 
                                        minHeight: '80px',
                                        borderRadius: '15px',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        color: color === 'yellow' ? 'black' : 'white',
                                        textTransform: 'uppercase',
                                        border: '3px solid white'
                                    }}
                                >
                                    {color === 'red' && 'Rouge'}
                                    {color === 'blue' && 'Bleu'}
                                    {color === 'green' && 'Vert'}
                                    {color === 'yellow' && 'Jaune'}
                                </Button>
                            </motion.div>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Game board component */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <UnoGameBoard3d
                    gameState={gameState}
                    myPlayer={myPlayer}
                    currentPlayer={currentPlayer}
                    isMyTurn={isMyTurn}
                    roomId={roomId}
                    connectionStatus={connectionStatus}
                    onPlayCard={handlePlayCard}
                    onDrawCard={handleDrawCard}
                    onRestartGame={handleRestartGame}
                    onStopGame={handleStopGame}
                    onSayUno={handleSayUno}
                    onDenyUno={handleDenyUno}
                />
            </Box>
        </Paper>
    );
}
