import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IRoom from "../../data_interfaces/IRoom";
import RoomDS from "../../data_services/RoomDS";
import RoomListItem from "./RoomListItem";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

export default function RoomList() {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshAnimation, setRefreshAnimation] = useState(false);
    const navigate = useNavigate();

    const fetchRooms = () => {
        // if the document is not visible, do not fetch data
        if (document.visibilityState !== "visible") return;

        setLoading(true);
        setRefreshAnimation(true);

        RoomDS.get()
            .then((response) => {
                setRooms(response.data);
                setLoading(false);

                // Reset animation after a short delay
                setTimeout(() => setRefreshAnimation(false), 1000);
            })
            .catch(() => {
                setLoading(false);
                setRefreshAnimation(false);
            });
    };

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleCreateRoom = () => {
        navigate("/create-room");
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)",
                minHeight: "100vh",
                padding: "2rem 0",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    zIndex: 0,
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            marginBottom: 4,
                            padding: 3,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            borderRadius: "15px",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                color: "#fff",
                                fontWeight: 700,
                                marginBottom: 3,
                                textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
                                letterSpacing: "3px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <MeetingRoomIcon sx={{ fontSize: 40, marginRight: 2 }} /> SALLES DE JEU
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleCreateRoom}
                                    startIcon={<AddIcon />}
                                    sx={{
                                        background: "linear-gradient(45deg, #ff9800 30%, #ff5722 90%)",
                                        color: "white",
                                        fontWeight: "bold",
                                        padding: "12px 24px",
                                        fontSize: "1rem",
                                        borderRadius: "25px",
                                        boxShadow: "0 4px 20px rgba(255, 152, 0, 0.5)",
                                        textTransform: "uppercase",
                                        border: "2px solid rgba(255,255,255,0.2)",
                                    }}
                                >
                                    Créer une salle
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={refreshAnimation ? { rotate: [0, 360] } : {}}
                                transition={{ duration: 1 }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={fetchRooms}
                                    disabled={loading}
                                    startIcon={
                                        loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />
                                    }
                                    sx={{
                                        background: "linear-gradient(45deg, #2196f3 30%, #03a9f4 90%)",
                                        color: "white",
                                        fontWeight: "bold",
                                        padding: "12px 24px",
                                        fontSize: "1rem",
                                        borderRadius: "25px",
                                        boxShadow: "0 4px 20px rgba(33, 150, 243, 0.5)",
                                        textTransform: "uppercase",
                                        border: "2px solid rgba(255,255,255,0.2)",
                                    }}
                                >
                                    Actualiser
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>

                <Box sx={{ marginTop: 4 }}>
                    {rooms.length > 0 ? (
                        <AnimatePresence>
                            {rooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <RoomListItem room={room} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    backgroundColor: "rgba(0,0,0,0.4)",
                                    padding: 8,
                                    borderRadius: "15px",
                                    backdropFilter: "blur(5px)",
                                }}
                            >
                                <VideogameAssetIcon sx={{ fontSize: 80, color: "#bdbdbd", marginBottom: 3 }} />
                                <Typography variant="h5" sx={{ color: "#fff" }}>
                                    {loading ? "Chargement des salles..." : "Aucune salle disponible. Créez-en une!"}
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
