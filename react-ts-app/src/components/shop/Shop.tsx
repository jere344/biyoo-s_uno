import React, { useState } from "react";
import { Typography, Container, Box, Chip, Paper } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@hooks/useUser";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import LandscapeIcon from "@mui/icons-material/Landscape";
import cardsCurrencyIcon from "@assets/img/cards_currency.png";
import AvatarEffects from "./avatareffects/AvatarEffects";
import GameEnvironments from "./gameenvironments/GameEnvironments";
import CardBacks from "./cardbacks/CardBacks";

// Custom Tab component
const AnimatedTab = ({
    icon,
    label,
    value,
    activeTab,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    activeTab: string;
    onClick: () => void;
}) => {
    const isActive = activeTab === value;

    return (
        <motion.div
            whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            style={{
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 15px",
                    borderRadius: "16px",
                    background: isActive
                        ? "linear-gradient(135deg, #5e35b1 0%, #3949ab 100%)"
                        : "linear-gradient(135deg, #283593 0%, #1a237e 100%)",
                    border: isActive ? "2px solid #b388ff" : "2px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    boxShadow: isActive
                        ? "0 8px 32px rgba(90, 55, 187, 0.6), inset 0 0 10px rgba(255,255,255,0.5)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                    width: "100%",
                    height: "100%",
                }}
            >
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                                "radial-gradient(circle at center, rgba(179, 136, 255, 0.2) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />
                )}

                <motion.div
                    animate={{
                        rotate: isActive ? [0, -5, 5, -5, 5, 0] : 0,
                        scale: isActive ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                        duration: isActive ? 0.5 : 0,
                        ease: "easeOut",
                    }}
                    style={{
                        fontSize: "2rem",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                        marginBottom: "10px",
                        filter: isActive ? "drop-shadow(0 0 8px rgba(179, 136, 255, 0.8))" : "none",
                    }}
                >
                    {icon}
                </motion.div>

                <Typography
                    variant="h6"
                    sx={{
                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                        fontWeight: isActive ? 700 : 500,
                        textShadow: isActive ? "0 0 10px rgba(255,255,255,0.5)" : "none",
                        letterSpacing: "1px",
                        transition: "all 0.3s ease",
                    }}
                >
                    {label}
                </Typography>

                {isActive && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        style={{
                            height: "3px",
                            background: "linear-gradient(to right, transparent, #b388ff, transparent)",
                            borderRadius: "3px",
                            marginTop: "8px",
                        }}
                    />
                )}
            </Box>
        </motion.div>
    );
};

const Shop: React.FC = () => {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("0");

    const handleTabChange = (newValue: string) => {
        setActiveTab(newValue);
    };

    const tabs = [
        { icon: <CardGiftcardIcon />, label: "Card Backs", value: "0" },
        { icon: <AutoFixHighIcon />, label: "Avatar Effects", value: "1" },
        { icon: <LandscapeIcon />, label: "Game Environments", value: "2" },
    ];

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
                    backgroundImage: "url('/assets/pattern_overlay.png')",
                    opacity: 0.07,
                    zIndex: 0,
                },
            }}
        >
            {/* Animated background elements */}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            >
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0.3 + Math.random() * 0.4,
                            scale: 0.5 + Math.random() * 0.8,
                        }}
                        animate={{
                            y: [null, Math.random() * -100, null],
                            rotate: [0, Math.random() * 360],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 20,
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        style={{
                            position: "absolute",
                            width: 20 + Math.random() * 30,
                            height: 20 + Math.random() * 30,
                            borderRadius: "50%",
                            background: `rgba(${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(
                                Math.random() * 100 + 150
                            )}, 255, 0.2)`,
                            boxShadow: "0 0 20px rgba(150, 150, 255, 0.5)",
                            filter: "blur(4px)",
                        }}
                    />
                ))}
            </Box>

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
                    <Paper
                        elevation={24}
                        sx={{
                            textAlign: "center",
                            marginBottom: 6,
                            padding: 4,
                            backgroundColor: "rgba(25,25,65,0.7)",
                            borderRadius: "24px",
                            boxShadow: "0 15px 35px rgba(0,0,0,0.4), inset 0 0 20px rgba(120,130,220,0.3)",
                            backdropFilter: "blur(15px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        {/* Animated floating particles in header */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                top: 0,
                                left: 0,
                                overflow: "hidden",
                                pointerEvents: "none",
                            }}
                        >
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        x: Math.random() * 100 - 50 + "%",
                                        y: Math.random() * 100 + "%",
                                        opacity: 0.3 + Math.random() * 0.4,
                                    }}
                                    animate={{
                                        y: [null, "-100%"],
                                        x: [null, `${Math.random() * 40 - 20 + (i % 2 ? 30 : -30)}%`],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 7,
                                        ease: "linear",
                                        repeat: Infinity,
                                    }}
                                    style={{
                                        position: "absolute",
                                        width: 5 + Math.random() * 10,
                                        height: 5 + Math.random() * 10,
                                        borderRadius: "50%",
                                        background: "rgba(255,215,0,0.6)",
                                        boxShadow: "0 0 10px rgba(255,215,0,0.8)",
                                    }}
                                />
                            ))}
                        </Box>

                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                textShadow: "0 0 15px rgba(100,120,255,0.8), 0 0 30px rgba(50,70,255,0.4)",
                                letterSpacing: "3px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                mb: 4,
                            }}
                        >
                            <motion.div
                                animate={{ rotate: [0, -5, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                            >
                                <ShoppingCartIcon
                                    sx={{
                                        fontSize: 50,
                                        marginRight: 2,
                                        filter: "drop-shadow(0 0 8px rgba(100,150,255,0.8))",
                                    }}
                                />
                            </motion.div>
                            <motion.span
                                initial={{ backgroundPosition: "0% 50%" }}
                                animate={{ backgroundPosition: "100% 50%" }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                                style={{
                                    background: "linear-gradient(90deg, #fff, #b388ff, #64b5f6, #fff)",
                                    backgroundSize: "300% 100%",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                MAGASIN DE CARTES
                            </motion.span>
                        </Typography>

                        <motion.div
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <Chip
                                icon={
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    >
                                        <img
                                            src={cardsCurrencyIcon}
                                            alt="Cards Currency"
                                            style={{ width: 32, height: 32 }}
                                        />
                                    </motion.div>
                                }
                                label={`${user?.cards_currency || 0} Cartes`}
                                sx={{
                                    padding: "24px 20px",
                                    fontSize: "1.5rem",
                                    fontWeight: "bold",
                                    background:
                                        "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.4) 50%, rgba(255,215,0,0.15) 100%)",
                                    border: "2px solid rgba(255,215,0,0.6)",
                                    color: "#ffd700",
                                    borderRadius: "30px",
                                    boxShadow: "0 8px 25px rgba(255,215,0,0.4), inset 0 0 10px rgba(255,255,255,0.2)",
                                    backdropFilter: "blur(5px)",
                                    textShadow: "0 0 10px rgba(255,215,0,0.8)",
                                }}
                            />
                        </motion.div>
                    </Paper>
                </motion.div>

                {/* Custom Tabs Header */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 3,
                            mb: 4,
                            px: 2,
                        }}
                    >
                        {tabs.map((tab) => (
                            <AnimatedTab
                                key={tab.value}
                                icon={tab.icon}
                                label={tab.label}
                                value={tab.value}
                                activeTab={activeTab}
                                onClick={() => handleTabChange(tab.value)}
                            />
                        ))}
                    </Box>
                </motion.div>

                {/* Tab Content with Animations */}
                <TabContext value={activeTab}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ width: "100%" }}
                        >
                            <Paper
                                elevation={8}
                                sx={{
                                    borderRadius: "24px",
                                    overflow: "hidden",
                                    backgroundColor: "rgba(30,30,70,0.7)",
                                    backdropFilter: "blur(15px)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
                                }}
                            >
                                <TabPanel value="0" sx={{ p: 3, width: "100%" }}>
                                    <CardBacks />
                                </TabPanel>

                                <TabPanel value="1" sx={{ p: 3, width: "100%" }}>
                                    <AvatarEffects />
                                </TabPanel>

                                <TabPanel value="2" sx={{ p: 3, width: "100%" }}>
                                    <GameEnvironments />
                                </TabPanel>
                            </Paper>
                        </motion.div>
                    </AnimatePresence>
                </TabContext>
            </Container>
        </Box>
    );
};

export default Shop;
