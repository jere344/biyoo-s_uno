import React from "react";
import { Grid, Card, Box, CardMedia, CardContent, Typography, Button, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import ICardBack from "@DI/ICardBack";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface InventoryCardBackItemProps {
    item: ICardBack;
    activateCardBack: (id: number) => void;
}

const InventoryCardBackItemProps: React.FC<ShopCardBackItemProps> = ({ item, activateCardBack }) => {
    return (
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
                                        <CheckCircleIcon sx={{ fontSize: 30, color: "#1b5e20" }} />
                                    </Box>
                                </Tooltip>
                            </motion.div>
                        </Box>
                    )}

                    <Box sx={{ padding: 3 }}>
                        <motion.div whileHover={{ rotateY: 10, rotateX: -5 }} style={{ transformStyle: "preserve-3d" }}>
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
                                        boxShadow: item.is_active ? "none" : "0 4px 20px rgba(33, 150, 243, 0.5)",
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
    );
};

export default InventoryCardBackItemProps;
