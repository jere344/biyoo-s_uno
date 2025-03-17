import React from "react";
import { Grid, Card, Box, Chip, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ICardBack from "@DI/ICardBack";

interface ShopCardBackItemProps {
    cardBack: ICardBack;
    purchaseCardBack: (id: number) => void;
    userCardsCurrency: number;
}

const ShopCardBackItem: React.FC<ShopCardBackItemProps> = ({ cardBack, purchaseCardBack, userCardsCurrency }) => {
    return (
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
                                rotateY: 0,
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
                                    disabled={userCardsCurrency < cardBack.price}
                                    startIcon={<CardGiftcardIcon />}
                                    sx={{
                                        background: "linear-gradient(45deg, #ff9800 30%, #ff5722 90%)",
                                        color: "white",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                        borderRadius: "25px",
                                        boxShadow: "0 4px 20px rgba(255, 152, 0, 0.5)",
                                        textTransform: "uppercase",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        opacity: userCardsCurrency < cardBack.price ? 0.6 : 1,
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
    );
};

export default ShopCardBackItem;
