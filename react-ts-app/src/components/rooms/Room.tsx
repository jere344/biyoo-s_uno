import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Button, TextField, IconButton, Box, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import IRoom from "@DI/IRoom";
import RoomDS from "@DS/RoomDS";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import UnoGame from "./UnoGame";
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

     // Refresh the room every 60 seconds
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
        }, 5000);

        return () => clearInterval(interval);
    }, [id]);

    const [editingName, setEditingName] = useState(false);
    const [newRoomName, setNewRoomName] = useState(room.name);

    const handleNameEditToggle = () => {
        setEditingName(!editingName);
        setNewRoomName(room.name);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewRoomName(event.target.value);
    };

    const handleNameSave = () => {
        if (!newRoomName.trim()) {
            setEditingName(false);
            return;
        }
        
        RoomDS.update(room.id, { name: newRoomName })
            .then((response) => {
                setRoom(response.data);
                setEditingName(false);
            })
            .catch((error) => {
                console.error("Error updating room name:", error);
            });
    };

    const handleToggleRoomStatus = () => {
        RoomDS.update(room.id, { is_open: !room.is_open })
            .then((response) => {
                setRoom(response.data);
            })
            .catch((error) => {
                console.error("Error toggling room status:", error);
            });
    };

    const handlePlayerLimitChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = parseInt(event.target.value, 10);
        if (isNaN(value) || value < 2 || value > 10) return;
        
        RoomDS.update(room.id, { player_limit: value })
            .then((response) => {
                setRoom(response.data);
            })
            .catch((error) => {
                console.error("Error updating player limit:", error);
            });
    };

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
                    {/* Room Header */}
                    <Box
                        sx={{
                            padding: "1.5rem",
                            background: "linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)",
                            borderRadius: "20px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                            marginBottom: "2rem",
                            overflow: "hidden",
                            position: "relative",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "100%",
                                background: "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                                transform: "translateX(-100%)",
                                animation: "shine 3s infinite",
                            },
                            "@keyframes shine": {
                                "0%": { transform: "translateX(-100%)" },
                                "50%": { transform: "translateX(100%)" },
                                "100%": { transform: "translateX(100%)" },
                            },
                        }}
                    >
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs={12} md={8}>
                                <Box display="flex" alignItems="center">
                                    <MeetingRoomIcon sx={{ fontSize: 42, marginRight: 2, color: "#ffeb3b" }} />
                                    {editingName ? (
                                        <TextField
                                            value={newRoomName}
                                            onChange={handleNameChange}
                                            variant="outlined"
                                            size="small"
                                            autoFocus
                                            onKeyPress={(e) => e.key === "Enter" && handleNameSave()}
                                            onBlur={handleNameSave}
                                            sx={{
                                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                borderRadius: "8px",
                                                width: "300px",
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "8px",
                                                },
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton onClick={handleNameSave} size="small">
                                                        <SaveIcon />
                                                    </IconButton>
                                                ),
                                            }}
                                        />
                                    ) : (
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color: "#ffffff",
                                                fontWeight: 700,
                                                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {room.name}
                                            <IconButton onClick={handleNameEditToggle} sx={{ color: "rgba(255,255,255,0.7)", ml: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                        </Typography>
                                    )}
                                </Box>
                                
                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                    <Typography
                                        sx={{ 
                                            color: "rgba(255,255,255,0.8)",
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: 500,
                                            mr: 3
                                        }}
                                    >
                                        <PeopleIcon sx={{ mr: 1 }} />
                                        {room.users.length}/{room.player_limit} joueurs
                                    </Typography>
                                    
                                    <motion.div 
                                        animate={{ 
                                            backgroundColor: room.is_open ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)",
                                            borderColor: room.is_open ? "#4caf50" : "#f44336",
                                        }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            border: "1px solid",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {room.is_open ? (
                                            <>
                                                <LockOpenIcon sx={{ fontSize: 18, marginRight: "0.3rem", color: "#4caf50" }} />
                                                <Typography sx={{ color: "#4caf50", fontWeight: 500 }}>Salle ouverte</Typography>
                                            </>
                                        ) : (
                                            <>
                                                <LockIcon sx={{ fontSize: 18, marginRight: "0.3rem", color: "#f44336" }} />
                                                <Typography sx={{ color: "#f44336", fontWeight: 500 }}>Salle fermée</Typography>
                                            </>
                                        )}
                                    </motion.div>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end", mt: { xs: 2, md: 0 } }}>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "flex-end" }}>
                                    {/* Room Status Toggle Button */}
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleToggleRoomStatus}
                                            startIcon={room.is_open ? <LockIcon /> : <LockOpenIcon />}
                                            sx={{
                                                background: room.is_open 
                                                    ? "linear-gradient(45deg, #f44336 30%, #ff9800 90%)" 
                                                    : "linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)",
                                                fontWeight: "bold",
                                                color: "white",
                                                padding: "10px 20px",
                                                borderRadius: "12px",
                                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                                textTransform: "none",
                                            }}
                                        >
                                            {room.is_open ? "Fermer la salle" : "Ouvrir la salle"}
                                        </Button>
                                    </motion.div>
                                    
                                    {/* Player Limit Control */}
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            type="number"
                                            label="Limite joueurs"
                                            value={room.player_limit}
                                            onChange={handlePlayerLimitChange}
                                            size="small"
                                            inputProps={{ min: 2, max: 10, step: 1 }}
                                            sx={{
                                                width: "150px",
                                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                                borderRadius: "12px",
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "12px",
                                                },
                                            }}
                                        />
                                    </Box>
                                    
                                    {/* Leave Room Button */}
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleLeaveRoom}
                                            startIcon={<ExitToAppIcon />}
                                            sx={{
                                                fontWeight: "bold",
                                                padding: "10px 20px",
                                                borderRadius: "12px",
                                                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                                textTransform: "none",
                                                background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
                                            }}
                                        >
                                            Quitter la salle
                                        </Button>
                                    </motion.div>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
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
                    <Grid item xs={12} md={8}>
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <UnoGame />
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
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
