import React, { useState, useEffect, useRef } from "react";
import { Typography, TextField, Button, Box, Avatar, IconButton, Zoom } from "@mui/material";
import { useParams } from "react-router-dom";
import ChatDS from "../../data_services/ChatDS";
import IMessage from "../../interfaces/IMessage";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import { storageUsernameKey, storageAccessTokenKey } from "../../data_services/CustomAxios";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
    const { id } = useParams(); // room id from route params
    const roomId = parseInt(id as string, 10);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const webSocketRef = useRef<WebSocket | null>(null);
    const notificationSound = new Audio('https://cdn.pixabay.com/download/audio/2023/12/09/audio_37d2c0e795.mp3?filename=tap-notification-180637.mp3');

    const CurrentUserName = localStorage.getItem(storageUsernameKey);

    // Fetch initial chat messages for the room
    const fetchMessages = () => {
        ChatDS.getMessages(roomId)
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                console.error("Error fetching chat messages:", error);
            });
    };

    // Setup WebSocket connection
    useEffect(() => {
        // Initial fetch of messages
        fetchMessages();
        
        // WebSocket setup
        const token = localStorage.getItem(storageAccessTokenKey);
        const wsUrl = `${import.meta.env.VITE_WS_URL}ws/rooms/${roomId}/chat/?token=${token}`;
        const ws = new WebSocket(wsUrl);
        webSocketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.message) {
                // Play notification sound for new messages
                notificationSound.play().catch(err => console.error('Error playing sound:', err));
                
                // Append the new message to the existing messages
                setMessages(prevMessages => [...prevMessages, data.message]);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        // Clean up WebSocket connection on component unmount
        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);

    // Scroll to bottom effect
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !webSocketRef.current) return;
        
        webSocketRef.current.send(JSON.stringify({
            id: Date.now(), // Temporary ID for the message
            room_id: roomId,
            content: newMessage
        }));
        
        setNewMessage("");
    };

    const handleDeleteMessage = (roomId: number, messageId: number) => {
        ChatDS.deleteMessage(roomId, messageId)
            .then(() => {
                setMessages(messages.filter((message) => message.id !== messageId));
            })
            .catch((error) => {
                console.error("Error deleting message:", error);
            });
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #1a237e 0%, #3f51b5 50%, #7986cb 100%)",
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                padding: "1rem",
                minHeight: "800px",
                maxHeight: "800px",
                display: "flex",
                flexDirection: "column",
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
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    sx={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        padding: "10px 20px",
                        borderRadius: "12px",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        backdropFilter: "blur(10px)",
                        zIndex: 1,
                        position: "relative",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                >
                    <ChatIcon sx={{ fontSize: 28, marginRight: 2, color: "#ff9800" }} />
                    <Typography 
                        variant="h6" 
                        sx={{
                            color: "#fff",
                            fontWeight: 600,
                            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                            letterSpacing: "1px"
                        }}
                    >
                        Discussion
                    </Typography>
                </Box>
            </motion.div>

            <Box
                ref={chatContainerRef}
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    marginBottom: "1rem",
                    padding: "10px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.3) transparent",
                    "&::-webkit-scrollbar": {
                        width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "rgba(0,0,0,0.1)",
                        borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "rgba(255,255,255,0.3)",
                        borderRadius: "4px",
                        "&:hover": {
                            background: "rgba(255,255,255,0.5)",
                        }
                    },
                    zIndex: 1,
                    position: "relative",
                }}
            >
                <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Box 
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginBottom: "0.8rem",
                                    position: "relative",
                                }}
                            >
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Avatar
                                        src={message.sender.profile_picture}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            marginRight: "0.7rem", 
                                            border: "2px solid",
                                            borderColor: message.sender.username === CurrentUserName ? "#4caf50" : "#2196f3",
                                            boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
                                        }}
                                    />
                                </motion.div>

                                <Box 
                                    sx={{
                                        background: message.sender.username === CurrentUserName
                                            ? "linear-gradient(135deg, #4caf50 0%, #81c784 100%)"
                                            : "linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)",
                                        padding: "10px 15px",
                                        borderRadius: message.sender.username === CurrentUserName
                                            ? "15px 15px 0 15px"
                                            : "0 15px 15px 15px",
                                        maxWidth: "85%",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                        wordBreak: "break-word",
                                        flexGrow: 1,
                                    }}
                                >
                                    <Box 
                                        display="flex" 
                                        alignItems="center" 
                                        justifyContent="space-between"
                                    >
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                fontWeight: "bold", 
                                                color: "rgba(255,255,255,0.9)",
                                                textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            {message.sender.username}
                                        </Typography>
                                        
                                        {message.sender.username === CurrentUserName && (
                                            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteMessage(roomId, message.id)}
                                                    sx={{
                                                        padding: "2px",
                                                        color: "rgba(255,255,255,0.7)",
                                                        "&:hover": { 
                                                            color: "#f44336",
                                                            background: "rgba(255,255,255,0.2)" 
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </motion.div>
                                        )}
                                    </Box>
                                    
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: "#fff",
                                            fontSize: "0.95rem",
                                            margin: "5px 0"
                                        }}
                                    >
                                        {message.content}
                                    </Typography>
                                    
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: "rgba(255,255,255,0.7)",
                                            fontStyle: "italic",
                                            fontSize: "0.75rem"
                                        }}
                                    >
                                        {new Date(message.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {messages.length === 0 && (
                    <Zoom in={true}>
                        <Box 
                            sx={{
                                textAlign: "center",
                                padding: "2rem",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                borderRadius: "15px",
                                backdropFilter: "blur(5px)"
                            }}
                        >
                            <Typography variant="h6" sx={{ color: "#fff" }}>
                                Pas de messages. Commencez la conversation!
                            </Typography>
                        </Box>
                    </Zoom>
                )}
            </Box>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box 
                    display="flex" 
                    sx={{ 
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "25px",
                        padding: "10px",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                        zIndex: 1,
                        position: "relative",
                    }}
                >
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                borderRadius: "20px",
                                "& fieldset": {
                                    borderColor: "rgba(63, 81, 181, 0.5)",
                                    borderRadius: "20px",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#3f51b5",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#3f51b5",
                                },
                            },
                            "& .MuiInputBase-input": {
                                padding: "12px 16px",
                            }
                        }}
                    />
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            endIcon={<SendIcon />}
                            sx={{
                                marginLeft: "0.8rem",
                                borderRadius: "20px",
                                padding: "10px 25px",
                                background: "linear-gradient(45deg, #ff9800 30%, #ff5722 90%)",
                                color: "white",
                                fontWeight: "bold",
                                textTransform: "none",
                                boxShadow: "0 4px 10px rgba(255, 152, 0, 0.5)",
                                border: "2px solid rgba(255,255,255,0.3)",
                                height: "100%",
                            }}
                        >
                            Envoyer
                        </Button>
                    </motion.div>
                </Box>
            </motion.div>
        </Box>
    );
}
