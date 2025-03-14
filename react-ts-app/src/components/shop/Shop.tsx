import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, CardMedia, Typography, Grid, Container, Box, Chip, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../hooks/useUser";
import ShopDS from "../../data_services/ShopDS";
import ICardBack from "../../data_interfaces/ICardBack";
import IInventory from "../../data_interfaces/IInventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
// import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import cardsCurrencyIcon from "@assets/img/cards_currency.png";
import InventoryIcon from "@mui/icons-material/Inventory";

const Shop: React.FC = () => {
    const { user } = useUser();
    const [cardBacks, setCardBacks] = useState<ICardBack[]>([]);
    const [inventory, setInventory] = useState<IInventory[]>([]);
    const [purchasedCardId, setPurchasedCardId] = useState<number | null>(null);

    useEffect(() => {
        fetchCardBacks();
        fetchInventory();
    }, []);

    const fetchCardBacks = async () => {
        const response = await ShopDS.getCardBacks();
        setCardBacks(response.data);
    };

    const fetchInventory = async () => {
        const response = await ShopDS.getInventory();
        setInventory(response.data);
    };

    const purchaseCardBack = async (cardBackId: number) => {
        const response = await ShopDS.purchaseCardBack(cardBackId);
        if (response.status === 201) {
            setPurchasedCardId(cardBackId);
            setTimeout(() => {
                setPurchasedCardId(null);
                fetchInventory();
            }, 2500);
        }
    };

    const activateCardBack = async (inventoryId: number) => {
        const response = await ShopDS.activateCardBack(inventoryId);
        if (response.status === 200) {
            fetchInventory();
        }
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #1a237e 0%, #3f51b5 50%, #7986cb 100%)",
                backgroundSize: "cover",
                minHeight: "100vh",
                paddingY: 4,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('/assets/pattern_overlay.png')", // Add a subtle pattern image
                    opacity: 0.07,
                    zIndex: 0,
                },
            }}
        >

            <Container
                maxWidth="lg"
                sx={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Shop Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            marginBottom: 4,
                            padding: 3,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: "15px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
                                letterSpacing: "3px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 40, marginRight: 2 }} /> MAGASIN DE CARTES
                        </Typography>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Chip
                                icon={
                                <img src={cardsCurrencyIcon} alt="Cards Currency" style={{ width: 32, height: 32 }}/>}
                                label={`${user?.cards_currency || 0} Cartes`}
                                sx={{
                                    padding: "24px 16px",
                                    fontSize: "1.5rem",
                                    fontWeight: "bold",
                                    backgroundColor: "rgba(255, 215, 0, 0.2)",
                                    border: "2px solid #ffd700",
                                    color: "#ffd700",
                                    borderRadius: "25px",
                                    boxShadow: "0 4px 15px rgba(255, 215, 0, 0.5)",
                                    backdropFilter: "blur(5px)",
                                }}
                            />
                        </motion.div>
                    </Box>
                </motion.div>

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
                        {cardBacks.filter((cardBack) => !inventory.some((item) => item.card_back.id === cardBack.id)).map((cardBack) => (
                            <Grid item xs={12} sm={6} md={4} key={cardBack.id}>
                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                        y: -10,
                                        boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <Card
                                        sx={{
                                            background: "linear-gradient(135deg, #311b92 0%, #512da8 100%)",
                                            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                            borderRadius: "15px",
                                            overflow: "visible",
                                            border: purchasedCardId === cardBack.id ? "3px solid #ffd700" : "none",
                                            position: "relative",
                                        }}
                                    >
                                        <Box sx={{ position: "absolute", top: -15, right: -15, zIndex: 2 }}>
                                            <Chip
                                                label={`${cardBack.price} cartes`}
                                                sx={{
                                                    backgroundColor: "#ff9800",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    padding: "10px 5px",
                                                    border: "3px solid #fff",
                                                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ padding: 3, position: "relative" }}>
                                            <motion.div
                                                animate={{
                                                    rotateY: purchasedCardId === cardBack.id ? [0, 360, 0] : 0,
                                                }}
                                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    alt="Card Back"
                                                    height="210"
                                                    image={cardBack.image}
                                                    title="Card Back"
                                                    sx={{
                                                        objectFit: "contain",
                                                        borderRadius: "10px",
                                                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                                                        transform: "perspective(1000px) rotateX(5deg)",
                                                        transition: "transform 0.3s ease",
                                                        "&:hover": {
                                                            transform: "perspective(1000px) rotateX(0deg) scale(1.05)",
                                                        },
                                                    }}
                                                />
                                            </motion.div>
                                        </Box>

                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                sx={{
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
                                                }}
                                            >
                                                {cardBack.name}
                                            </Typography>

                                            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => purchaseCardBack(cardBack.id)}
                                                        startIcon={<CardGiftcardIcon />}
                                                        sx={{
                                                            background:
                                                                "linear-gradient(45deg, #ff9800 30%, #ff5722 90%)",
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            padding: "10px 20px",
                                                            borderRadius: "25px",
                                                            boxShadow: "0 4px 20px rgba(255, 152, 0, 0.5)",
                                                            textTransform: "uppercase",
                                                            border: "2px solid rgba(255,255,255,0.3)",
                                                        }}
                                                    >
                                                        Acheter
                                                    </Button>
                                                </motion.div>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
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
                                <Grid item xs={12} sm={6} md={4} key={item.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        transition={{ duration: 0.5 }}
                                        whileHover={{
                                            scale: 1.05,
                                            y: -10,
                                            boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                background: item.is_active
                                                    ? "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)"
                                                    : "linear-gradient(135deg, #424242 0%, #616161 100%)",
                                                boxShadow: item.is_active
                                                    ? "0 10px 20px rgba(76, 175, 80, 0.4)"
                                                    : "0 10px 20px rgba(0,0,0,0.2)",
                                                borderRadius: "15px",
                                                border: item.is_active ? "3px solid gold" : "none",
                                                position: "relative",
                                                overflow: "visible",
                                            }}
                                        >
                                            {item.is_active && (
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: -15,
                                                        right: -15,
                                                        zIndex: 2,
                                                        animation: "pulse 1.5s infinite",
                                                    }}
                                                >
                                                    <motion.div
                                                        animate={{ rotate: [0, 10, -10, 10, 0] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                    >
                                                        <Tooltip title="Currently Active">
                                                            <Box
                                                                sx={{
                                                                    backgroundColor: "#ffd700",
                                                                    borderRadius: "50%",
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    boxShadow: "0 0 10px 5px rgba(255, 215, 0, 0.5)",
                                                                }}
                                                            >
                                                                <CheckCircleIcon
                                                                    sx={{ fontSize: 30, color: "#1b5e20" }}
                                                                />
                                                            </Box>
                                                        </Tooltip>
                                                    </motion.div>
                                                </Box>
                                            )}

                                            <Box sx={{ padding: 3 }}>
                                                <motion.div
                                                    whileHover={{ rotateY: 10, rotateX: -5 }}
                                                    style={{ transformStyle: "preserve-3d" }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        alt="Card Back"
                                                        height="210"
                                                        image={item.card_back.image}
                                                        title="Card Back"
                                                        sx={{
                                                            objectFit: "contain",
                                                            borderRadius: "10px",
                                                            boxShadow: item.is_active
                                                                ? "0 5px 25px rgba(255, 215, 0, 0.5)"
                                                                : "0 5px 15px rgba(0,0,0,0.3)",
                                                            filter: item.is_active ? "none" : "brightness(0.8)",
                                                        }}
                                                    />
                                                </motion.div>
                                            </Box>

                                            <CardContent>
                                                <Typography
                                                    gutterBottom
                                                    variant="h5"
                                                    component="div"
                                                    sx={{
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                        textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
                                                    }}
                                                >
                                                    {item.card_back.name}
                                                </Typography>

                                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => activateCardBack(item.id)}
                                                            disabled={item.is_active}
                                                            startIcon={<CheckCircleIcon />}
                                                            sx={{
                                                                background: item.is_active
                                                                    ? "rgba(255,255,255,0.3)"
                                                                    : "linear-gradient(45deg, #42a5f5 30%, #2196f3 90%)",
                                                                color: "white",
                                                                fontWeight: "bold",
                                                                padding: "10px 20px",
                                                                borderRadius: "25px",
                                                                boxShadow: item.is_active
                                                                    ? "none"
                                                                    : "0 4px 20px rgba(33, 150, 243, 0.5)",
                                                                textTransform: "uppercase",
                                                                border: item.is_active
                                                                    ? "2px solid rgba(255,255,255,0.3)"
                                                                    : "2px solid #bbdefb",
                                                            }}
                                                        >
                                                            {item.is_active ? "Activé" : "Activer"}
                                                        </Button>
                                                    </motion.div>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
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
            </Container>
        </Box>
    );
};

export default Shop;
