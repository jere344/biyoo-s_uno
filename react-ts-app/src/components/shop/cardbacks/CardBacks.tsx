import React, { useEffect, useState } from "react";
import {
    Button,
    CardMedia,
    Typography,
    Grid,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ShopDS from "@DS/ShopDS";
import ICardBack from "@DI/ICardBack";
import IInventory from "@DI/IInventory";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CloseIcon from "@mui/icons-material/Close";
import ShopCardBackItem from "./ShopCardBackItem";
import InventoryCardBackItem from "./InventoryCardBackItem";

interface CardBacksProps {
    userCardsCurrency: number;
}

const CardBacks: React.FC<CardBacksProps> = ({ userCardsCurrency }) => {
    const [cardBacks, setCardBacks] = useState<ICardBack[]>([]);
    const [inventory, setInventory] = useState<IInventory[]>([]);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);
    const [newCardBack, setNewCardBack] = useState<ICardBack | null>(null);
    const [newInventoryId, setNewInventoryId] = useState<number | null>(null);


    useEffect(() => {
        // we are waiting for both data to be fetched before setting the state
        // because the display of inventory depends on the shop data
        // and the display of the shop data depends on the inventory data
        // so it was causing a flickering effect
        const fetchData = async () => {
            try {
                const [cardBacksResponse, inventoryResponse] = await Promise.all([
                    ShopDS.getCardBacks(),
                    ShopDS.getCardBackInventory()
                ]);
                setCardBacks(cardBacksResponse.data);
                setInventory(inventoryResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        
        fetchData();
    }, []);

    const fetchInventory = async () => {
        const response = await ShopDS.getCardBackInventory();
        setInventory(response.data);
    };

    const purchaseCardBack = async (cardBackId: number) => {
        try {
            const response = await ShopDS.purchaseCardBack(cardBackId);
            if (response.status === 201) {
                // Get the card back details to show in the modal
                const purchasedCardBack = cardBacks.find((card) => card.id === cardBackId);
                setNewCardBack(purchasedCardBack || null);
                setNewInventoryId(response.data.id);
                setPurchaseSuccess(true);
                fetchInventory(); // Refresh inventory
            }
        } catch (error: unknown) {
            setPurchaseError(error.response?.data?.error || "Failed to purchase card back");
            setTimeout(() => setPurchaseError(null), 5000); // Clear error after 5 seconds
        }
    };

    const activateCardBack = async (inventoryId: number) => {
        const response = await ShopDS.activateCardBack(inventoryId);
        if (response.status === 200) {
            fetchInventory();
            // Close the modal if we're activating from the modal
            if (purchaseSuccess) {
                handleCloseSuccessModal();
            }
        }
    };

    const handleCloseSuccessModal = () => {
        setPurchaseSuccess(false);
        setNewCardBack(null);
        setNewInventoryId(null);
    };

    return (
        <>
            {/* Purchase Success Modal */}
            <Dialog
                open={purchaseSuccess && newCardBack !== null}
                onClose={handleCloseSuccessModal}
                PaperProps={{
                    style: {
                        borderRadius: "20px",
                        backgroundColor: "rgba(55, 65, 81, 0.95)",
                        padding: "10px",
                        boxShadow: "0 0 30px rgba(255, 152, 0, 0.6)",
                        maxWidth: "500px",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        color: "#fff",
                        textAlign: "center",
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        background: "linear-gradient(135deg, #ff9800 0%, #ff5722 100%)",
                        borderRadius: "10px",
                        marginBottom: "15px",
                        padding: "15px",
                    }}
                >
                    Achat Réussi !
                </DialogTitle>
                <DialogContent sx={{ padding: "20px" }}>
                    {newCardBack && (
                        <Box sx={{ textAlign: "center" }}>
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CardMedia
                                    component="img"
                                    image={newCardBack.image}
                                    alt={newCardBack.name}
                                    sx={{
                                        height: "250px",
                                        objectFit: "contain",
                                        borderRadius: "10px",
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                                        margin: "0 auto 20px",
                                    }}
                                />
                                <Typography variant="h5" sx={{ color: "#fff", marginBottom: "15px" }}>
                                    {newCardBack.name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#ccc", marginBottom: "20px" }}>
                                    Ce dos de carte a été ajouté à votre collection !
                                </Typography>
                            </motion.div>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", padding: "10px 20px 20px" }}>
                    <Button
                        onClick={() => newInventoryId !== null && activateCardBack(newInventoryId)}
                        sx={{
                            background: "linear-gradient(45deg, #42a5f5 30%, #2196f3 90%)",
                            color: "white",
                            fontWeight: "bold",
                            padding: "10px 25px",
                            borderRadius: "25px",
                            boxShadow: "0 4px 20px rgba(33, 150, 243, 0.5)",
                            margin: "0 10px",
                            fontSize: "1rem",
                        }}
                    >
                        Équiper
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

            {/* Store Items */}
            <Box sx={{ marginBottom: 6 }}>
                <Box
                    sx={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        padding: "15px 25px",
                        borderRadius: "20px 20px 0 0",
                        marginBottom: 2,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <CardGiftcardIcon sx={{ fontSize: 32, marginRight: 2, color: "#ff9800" }} />
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#fff",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Dos de cartes disponibles
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {cardBacks
                        .filter((cardBack) => !inventory.some((item) => item.card_back.id === cardBack.id))
                        .map((cardBack) => (
                            <ShopCardBackItem
                                key={cardBack.id}
                                cardBack={cardBack}
                                purchaseCardBack={purchaseCardBack}
                                userCardsCurrency={userCardsCurrency}
                            />
                        ))}
                </Grid>
            </Box>

            {/* Inventory */}
            <Box sx={{ marginTop: 6 }}>
                <Box
                    sx={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        padding: "15px 25px",
                        borderRadius: "20px 20px 0 0",
                        marginBottom: 2,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <InventoryIcon sx={{ fontSize: 32, marginRight: 2, color: "#4caf50" }} />
                    <Typography
                        variant="h5"
                        sx={{
                            color: "#fff",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Votre Collection
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    <AnimatePresence>
                        {inventory.map((item) => (
                            <InventoryCardBackItem key={item.id} item={item} activateCardBack={activateCardBack} />
                        ))}
                    </AnimatePresence>

                    {inventory.length === 0 && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    padding: 5,
                                    backgroundColor: "rgba(0,0,0,0.4)",
                                    borderRadius: "15px",
                                }}
                            >
                                <Typography variant="h6" sx={{ color: "#fff" }}>
                                    Vous n'avez pas encore de dos de cartes. Achetez-en dans la boutique!
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </>
    );
};

export default CardBacks;
