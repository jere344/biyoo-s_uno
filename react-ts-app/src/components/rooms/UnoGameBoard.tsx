import React, { useState } from "react";
import {
    Typography,
    Box,
    Button,
    Alert,
    Divider,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
	Avatar
} from "@mui/material";
import UnoGameCard from "./UnoGameCard";
import UnoOpponentsList from "./UnoOpponentsList";


interface UnoGameBoardProps {
    gameState: IUnoGame;
    myPlayer: IUnoPlayer | null;
    currentPlayer: IUnoPlayer | null;
    isMyTurn: boolean;
    roomId: number;
    connectionStatus: "connected" | "disconnected" | "connecting";
    onPlayCard: (cardId: number) => void;
    onDrawCard: () => void;
    onRestartGame: () => void;
    onStopGame: () => void;
}

const UnoGameBoard: React.FC<UnoGameBoardProps> = ({
    gameState,
    myPlayer,
    currentPlayer,
    isMyTurn,
    roomId,
    connectionStatus,
    onPlayCard,
    onDrawCard,
    onRestartGame,
    onStopGame,
}) => {
    const [openStopDialog, setOpenStopDialog] = useState<boolean>(false);

    // Render game status section
    const renderGameStatus = () => {
        return (
            <Box sx={{ mb: 3, textAlign: "center" }}>
                {gameState.game_over == true && (
                    <Alert
                        severity="info"
						sx={{ display: "flex", alignItems: "center" }} 
                        action={
                            <Button color="primary" size="small" variant="contained" onClick={onRestartGame}>
                                Redémarrer
                            </Button>
                        }
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography variant="subtitle1">Fin de la partie! Victoire:</Typography>
                            {gameState.winner.user.profile_picture && (
                                <Avatar
                                    src={gameState.winner.user.profile_picture}
                                    sx={{ width: 32, height: 32, marginRight: 1, marginLeft: 1}}
                                />
                            )}
                            <Typography variant="subtitle1">{gameState.winner.user.username || "Nobody"}</Typography>
                        </Box>
                    </Alert>
                )}

                {gameState.game_over == false && (
                    <Box>
                        <Typography variant="h6">
                            Tour: {currentPlayer?.user.username}
                            {currentPlayer?.hand === 1 && <span style={{ color: "red" }}> UNO!</span>}
                        </Typography>
                        <Typography variant="body2">Direction: {gameState.direction === true ? "→" : "←"}</Typography>
                        <Button
                            color="error"
                            size="small"
                            variant="outlined"
                            onClick={() => setOpenStopDialog(true)}
                            sx={{ mt: 1 }}
                        >
                            Arrêter la partie
                        </Button>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box>
            {/* Game header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    UNO
                </Typography>
                <Chip label={`Room #${roomId}`} variant="outlined" size="small" sx={{ mr: 1 }} />
                <Chip
                    label={connectionStatus}
                    color={connectionStatus === "connected" ? "success" : "error"}
                    size="small"
                />
            </Box>

            {/* Game status section */}
            {renderGameStatus()}

            {/* Other players section */}
            <UnoOpponentsList gameState={gameState} myPlayer={myPlayer} />

            {/* Game board section */}
            <Box sx={{ mb: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ position: "relative", width: "250px", height: "200px" }}>
                    {/* current card */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        {gameState.current_card && <UnoGameCard card={gameState.current_card} size="large" />}
                    </Box>

                    {/* Draw pile */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "10%",
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <UnoGameCard
                            card={gameState.card_back}
                            isPlayable={isMyTurn}
                            modifier={isMyTurn ? "highlight" : "default"}
                            onClick={onDrawCard}
                        />
                        <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1 }}>
                            Pioche
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Player's hand section */}
            <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 2 }}>
                    <Chip label="Votre Main" />
                </Divider>

                <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                    {myPlayer?.hand.length > 0 ? (
                        myPlayer.hand.map((card) => (
                            <UnoGameCard
                                key={card.id}
                                card={card}
                                isPlayable={isMyTurn && card.can_play}
                                modifier={isMyTurn ? (card.can_play ? "highlight" : "darken") : "default"}
                                onClick={() => onPlayCard(card.id)}
                            />
                        ))
                    ) : (
                        <Typography variant="body1" color="textSecondary">
                            Tu n'as pas de cartes.
                        </Typography>
                    )}
                </Box>

                {isMyTurn && (
                    <Typography variant="subtitle1" sx={{ textAlign: "center", mt: 2, color: "green" }}>
                        C'est à toi de jouer! Pose une carte ou pioche dans la pile.
                    </Typography>
                )}
            </Box>

            {/* Stop Game Confirmation Dialog */}
            <Dialog open={openStopDialog} onClose={() => setOpenStopDialog(false)}>
                <DialogTitle>Confirmer l'arrêt de la partie</DialogTitle>
                <DialogContent>
                    <Typography>
                        Attention : Cette action arrêtera la partie pour tous les joueurs. Êtes-vous sûr de vouloir
                        continuer ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStopDialog(false)}>Annuler</Button>
                    <Button
                        onClick={() => {
                            onStopGame();
                            setOpenStopDialog(false);
                        }}
                        color="error"
                        variant="contained"
                    >
                        Arrêter la partie
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UnoGameBoard;
