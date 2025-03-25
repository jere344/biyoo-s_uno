import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CardMedia, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

interface GameEnvironmentPurchaseDialogProps {
    purchaseSuccess: boolean;
    newEnvironment: { image: string; name: string } | null;
    newInventoryId: number | null;
    handleCloseSuccessModal: () => void;
    activateEnvironment: (id: number) => void;
}

const GameEnvironmentPurchaseDialog: React.FC<GameEnvironmentPurchaseDialogProps> = ({
    purchaseSuccess,
    newEnvironment,
    newInventoryId,
    handleCloseSuccessModal,
    activateEnvironment,
}) => {
    return (
        <Dialog
            open={purchaseSuccess && newEnvironment !== null}
            onClose={handleCloseSuccessModal}
            PaperProps={{
                style: {
                    borderRadius: "20px",
                    backgroundColor: "rgba(55, 65, 81, 0.95)",
                    padding: "10px",
                    boxShadow: "0 0 40px rgba(104, 109, 224, 0.7)",
                    maxWidth: "600px",
                },
            }}
        >
            <DialogTitle
                sx={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    padding: "15px",
                }}
            >
                Nouvel Environnement Acquis !
            </DialogTitle>
            <DialogContent sx={{ padding: "20px" }}>
                {newEnvironment && (
                    <Box sx={{ textAlign: "center" }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CardMedia
                                component="img"
                                image={newEnvironment.image}
                                alt={newEnvironment.name}
                                sx={{
                                    height: "250px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                                    margin: "0 auto 20px",
                                }}
                            />
                            <Typography variant="h5" sx={{ color: "#fff", marginBottom: "15px" }}>
                                {newEnvironment.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#ccc", marginBottom: "20px" }}>
                                Cet environnement de jeu a été ajouté à votre collection. Équipez-le pour
                                transformer votre expérience !
                            </Typography>
                        </motion.div>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", padding: "10px 20px 20px" }}>
                <Button
                    onClick={() => newInventoryId !== null && activateEnvironment(newInventoryId)}
                    sx={{
                        background: "linear-gradient(45deg, #6C5CE7 30%, #a29bfe 90%)",
                        color: "white",
                        fontWeight: "bold",
                        padding: "10px 25px",
                        borderRadius: "25px",
                        boxShadow: "0 4px 20px rgba(108, 92, 231, 0.5)",
                        margin: "0 10px",
                        fontSize: "1rem",
                    }}
                >
                    Activer maintenant
                </Button>
                <Button
                    onClick={handleCloseSuccessModal}
                    startIcon={<CloseIcon />}
                    sx={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                        padding: "10px 25px",
                        borderRadius: "25px",
                        margin: "0 10px",
                        fontSize: "1rem",
                    }}
                >
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GameEnvironmentPurchaseDialog;