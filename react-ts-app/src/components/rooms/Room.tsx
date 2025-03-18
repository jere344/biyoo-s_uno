import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Avatar } from "@mui/material";
import Grid from '@mui/material/Grid2';
import PeopleIcon from "@mui/icons-material/People";

import IRoom from "@DI/IRoom";
import RoomDS from "@DS/RoomDS";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import UnoGame from "./UnoGame";
import RoomHeader from "./RoomHeader";
import { motion, AnimatePresence } from "framer-motion";

export default function Room() {
    const { id } = useParams();
    const [room, setRoom] = useState<IRoom>({
        id: 0,
        name: "",
        is_open: true,
        player_limit: 2,
        users: [],
        created_at:"",
        invitation_code: "",
    });

    const navigate = useNavigate();

    // initial room fetch
    useEffect(() => {
        if (!id) return;
        
        RoomDS.getOne(parseInt(id, 10))
            .then((response) => {
                setRoom(response.data);
            })
            .catch((error) => {
                console.error("Error fetching room:", error);
                navigate("/");
            });
    }, [navigate, id]);

     // Refresh the room every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!id) return;

            RoomDS.getOne(parseInt(id, 10))
                .then((response) => {
                    setRoom(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching room:", error);
                });
        }, 10000);

        return () => clearInterval(interval);
    }, [id]);

    const handleLeaveRoom = () => {
        RoomDS.leave(room.id)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Error leaving room:", error);
            });
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #0d253f 0%, #1e3c72 100%)",
                minHeight: "100vh",
                paddingTop: "2rem",
                paddingBottom: "4rem",
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
                    opacity: 0.05,
                    zIndex: 0,
                },
            }}
        >
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Room Header Component */}
                    <RoomHeader 
                        room={room} 
                        onRoomUpdate={setRoom} 
                        onLeaveRoom={handleLeaveRoom} 
                    />
                </motion.div>

                {/* Players List */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Box 
                        sx={{
                            padding: "1rem",
                            background: "linear-gradient(to right, rgba(32,32,32,0.7), rgba(64,64,64,0.7))",
                            borderRadius: "15px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                            marginBottom: "2rem",
                            backdropFilter: "blur(10px)",
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                borderBottom: "2px solid rgba(255,255,255,0.1)", 
                                paddingBottom: "10px",
                                marginBottom: "15px",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: 600,
                            }}
                        >
                            <PeopleIcon sx={{ mr: 1 }} />
                            Joueurs dans la salle
                        </Typography>
                        
                        <Box 
                            sx={{
                                display: "flex", 
                                flexWrap: "wrap", 
                                gap: 2,
                                justifyContent: { xs: "center", sm: "flex-start" }
                            }}
                        >
                            <AnimatePresence>
                                {room.users.map((user) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Box
                                            sx={{
                                                background: "linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)",
                                                borderRadius: "15px",
                                                padding: "1rem",
                                                width: "150px",
                                                textAlign: "center",
                                                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                            }}
                                        >
                                            <Avatar 
                                                src={user.profile_picture} 
                                                sx={{ 
                                                    width: 70, 
                                                    height: 70, 
                                                    margin: "0 auto 10px",
                                                    border: "3px solid #ad1457",
                                                    boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
                                                }} 
                                            />
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    fontSize: "1.1rem",
                                                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                                                    wordBreak: "break-word"
                                                }}
                                            >
                                                {user.username}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {room.users.length < room.player_limit && Array.from({ length: room.player_limit - room.users.length }).map((_, index) => (
                                <motion.div
                                    key={`empty-${index}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Box
                                        sx={{
                                            background: "rgba(255,255,255,0.05)",
                                            borderRadius: "15px",
                                            padding: "1rem",
                                            width: "150px",
                                            height: "143px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                                            border: "1px dashed rgba(255,255,255,0.2)",
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                margin: "0 auto 10px",
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                            }}
                                        />
                                        <Typography variant="body2" 
                                            sx={{ 
                                            color: "rgba(255,255,255,0.5)",
                                            textAlign: "center",
                                            }}>
                                            Place disponible
                                        </Typography>
                                    </Box>
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                </motion.div>

                {/* Game Area and Chat */}
                <Grid container spacing={3}>
                    <Grid size={{xs:12, md:8}}>
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <UnoGame />
                        </motion.div>
                    </Grid>
                    
                    <Grid size={{xs:12, md:4}}>
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Chat />
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
