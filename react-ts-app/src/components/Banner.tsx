import { NavigateFunction, useNavigate } from "react-router-dom";
import { storageAccessTokenKey } from "../data_services/CustomAxios";
import { AppBar, Container, Link, Toolbar, Typography, Box, IconButton, Button, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "./App";
import BannerUserMenu from "./BannerUserMenu";
import { useUser } from "../hooks/useUser";
import cardsCurrencyIcon from "@assets/img/cards_currency.png";
import React from "react";
import { motion } from "framer-motion";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CasinoIcon from '@mui/icons-material/Casino';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

function Banner() {
    const navigate: NavigateFunction = useNavigate();
    const { user } = useUser();
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                background: "linear-gradient(90deg, #1a237e 0%, #3949ab 100%)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)"
            }}
        >
            <Container component="nav" maxWidth={false}>
                <Toolbar>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            color="inherit"
                            onClick={() => navigate("/")}
                            sx={{ 
                                cursor: "pointer", 
                                textDecoration: "none", 
                                marginRight: "1.5rem",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <CasinoIcon sx={{ mr: 1, fontSize: 28 }} />
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: "bold",
                                    background: "linear-gradient(45deg, #FF9800 30%, #FF5722 90%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                                    letterSpacing: "1px"
                                }}
                            >
                                Biyoo's Uno
                            </Typography>
                        </Link>
                    </motion.div>

                    {user?.room_id && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => navigate(`/room/${user.room_id}`)}
                                sx={{
                                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                    borderRadius: "20px",
                                    padding: "8px 16px",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    boxShadow: "0 3px 10px rgba(33, 150, 243, 0.4)",
                                }}
                                startIcon={<MeetingRoomIcon />}
                            >
                                Room {user.room_id}
                            </Button>
                        </motion.div>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    {localStorage.getItem(storageAccessTokenKey) ? (
                        <Box display="flex" alignItems="center" gap={2}>
                            {/* Dashboard Link */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Tooltip title="Dashboard">
                                    <IconButton 
                                        color="inherit" 
                                        onClick={() => navigate("/")}
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,0.2)",
                                            }
                                        }}
                                    >
                                        <DashboardIcon />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>

                            {/* Leaderboard Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Tooltip title="Leaderboard">
                                    <IconButton 
                                        color="inherit" 
                                        onClick={() => navigate("/leaderboard")}
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,0.2)",
                                            }
                                        }}
                                    >
                                        <LeaderboardIcon />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                            
                            {/* Shop Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Tooltip title="Shop">
                                    <IconButton 
                                        color="inherit" 
                                        onClick={() => navigate("/shop")}
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,0.2)",
                                            }
                                        }}
                                    >
                                        <ShoppingCartIcon />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>

                            {/* Currency Display */}
                            <motion.div
                                whileHover={{ y: -3 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Box 
                                    sx={{ 
                                        display: "flex", 
                                        alignItems: "center",
                                        backgroundColor: "rgba(255, 215, 0, 0.2)",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        border: "1px solid rgba(255, 215, 0, 0.5)",
                                        boxShadow: "0 2px 8px rgba(255, 215, 0, 0.3)"
                                    }}
                                >
                                    <motion.div 
                                        animate={{ rotate: [0, 10, -10, 10, 0] }} 
                                        transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
                                    >
                                        <img 
                                            src={cardsCurrencyIcon} 
                                            alt="Cards Currency" 
                                            style={{ 
                                                height: "24px", 
                                                marginRight: "8px",
                                                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
                                            }} 
                                        />
                                    </motion.div>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: "#ffd700", 
                                            fontWeight: "bold",
                                            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                                        }}
                                    >
                                        {user?.cards_currency || 0}
                                    </Typography>
                                </Box>
                            </motion.div>

                            {/* User Display */}
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        marginRight: "0.5rem",
                                        fontWeight: "bold",
                                        color: "#fff",
                                        textShadow: "1px 1px 3px rgba(0,0,0,0.4)"
                                    }}
                                >
                                    {user?.username}
                                </Typography>
                                <BannerUserMenu />
                            </Box>

                            {/* Theme Toggle */}
                            <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                                <Tooltip title={theme.palette.mode === 'dark' ? "Light Mode" : "Dark Mode"}>
                                    <IconButton 
                                        onClick={colorMode.toggleColorMode} 
                                        color="inherit"
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,0.2)",
                                            }
                                        }}
                                    >
                                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        </Box>
                    ) : (
                        <Box display="flex" alignItems="center" gap={2}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate("/login/")}
                                    sx={{
                                        background: "linear-gradient(45deg, #FF9800 30%, #FF5722 90%)",
                                        borderRadius: "20px",
                                        padding: "8px 20px",
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        boxShadow: "0 3px 10px rgba(255, 152, 0, 0.4)",
                                    }}
                                >
                                    Se connecter
                                </Button>
                            </motion.div>
                            
                            <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                                <Tooltip title={theme.palette.mode === 'dark' ? "Light Mode" : "Dark Mode"}>
                                    <IconButton 
                                        onClick={colorMode.toggleColorMode} 
                                        color="inherit"
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": {
                                                backgroundColor: "rgba(255,255,255,0.2)",
                                            }
                                        }}
                                    >
                                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Banner;
