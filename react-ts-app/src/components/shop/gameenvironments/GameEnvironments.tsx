import React from "react";
import {
    Box,
    Alert,
    Snackbar,
    Typography,
} from "@mui/material";
import LandscapeIcon from "@mui/icons-material/Landscape";
import useGameEnvironments from "./hooks/useGameEnvironments";
import GameEnvironmentPurchaseDialog from "./GameEnvironmentPurchaseDialog";
import GameEnvironmentYourCollection from "./GameEnvironmentYourCollection";
import GameEnvironmentCarousel from "./GameEnvironmentCarousel";

interface GameEnvironmentsProps {
    userCardsCurrency: number;
}

const GameEnvironments: React.FC<GameEnvironmentsProps> = ({ userCardsCurrency }) => {
    const {
        environments,
        inventory,
        loading,
        purchaseSuccess,
        purchaseError,
        newEnvironment,
        newInventoryId,
        handlePurchaseEnvironment,
        handleActivateEnvironment,
        handleCloseSuccessModal,
        setPurchaseError,
        isOwned,
        isActive,
        getInventoryId
    } = useGameEnvironments();

    return (
        <>
			{/* Purchase Success Modal */}
            <GameEnvironmentPurchaseDialog 
                purchaseSuccess={purchaseSuccess}
                newEnvironment={newEnvironment}
                newInventoryId={newInventoryId}
                handleCloseSuccessModal={handleCloseSuccessModal}
                activateEnvironment={handleActivateEnvironment}
            />

            {/* Purchase Error Snackbar */}
            <Snackbar
                open={purchaseError !== null}
                autoHideDuration={5000}
                onClose={() => setPurchaseError(null)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="error"
                    sx={{
                        width: "100%",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                        fontSize: "1rem",
                        fontWeight: "medium",
                    }}
                    onClose={() => setPurchaseError(null)}
                >
                    {purchaseError}
                </Alert>
            </Snackbar>

            {/* Main Content */}
            <Box sx={{ position: "relative", px: 2, overflow: "hidden" }}>
                {/* Header */}
                <Box
                    sx={{
                        backgroundColor: "rgba(104, 109, 224, 0.8)",
                        padding: "20px 25px",
                        borderRadius: "20px",
                        marginBottom: 4,
                        display: "flex",
                        alignItems: "center",
                        backgroundImage: "linear-gradient(to right, rgba(104, 109, 224, 0.8), rgba(72, 52, 212, 0.8))",
                        boxShadow: "0 8px 25px rgba(104, 109, 224, 0.3)",
                    }}
                >
                    <LandscapeIcon sx={{ fontSize: 40, marginRight: 2, color: "#fff" }} />
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                color: "#fff",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                        >
                            Environnements de Jeu
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: "rgba(255,255,255,0.8)",
                                mt: 0.5,
                            }}
                        >
                            Personnalisez votre expérience avec des décors spectaculaires
                        </Typography>
                    </Box>
                </Box>

                {/* 3D Carousel */}
                <GameEnvironmentCarousel 
                    environments={environments}
                    loading={loading}
                    userCardsCurrency={userCardsCurrency}
                    isOwned={isOwned}
                    isActive={isActive}
                    getInventoryId={getInventoryId}
                    onPurchase={handlePurchaseEnvironment}
                    onActivate={handleActivateEnvironment}
                />

                {/* Your Collection */}
                <GameEnvironmentYourCollection
                    inventory={inventory}
                    activateEnvironment={handleActivateEnvironment}
                />
            </Box>
        </>
    );
};

export default GameEnvironments;
