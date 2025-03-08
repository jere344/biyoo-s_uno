// src/components/Chat.tsx
import React, { useState, useEffect, useRef } from "react";
import { Paper, Typography, TextField, Button, Box, Avatar, IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import ChatDS from "../../data_services/ChatDS";
import IMessage from "../../interfaces/IMessage";
import DeleteIcon from "@mui/icons-material/Delete";
import { storageUsernameKey, storageAccessTokenKey } from "../../data_services/CustomAxios";

export default function Chat() {
    const { id } = useParams(); // room id from route params
    const roomId = parseInt(id as string, 10);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const webSocketRef = useRef<WebSocket | null>(null);
    const notificationSound = new Audio('https://cdn.pixabay.com/download/audio/2023/12/09/audio_37d2c0e795.mp3?filename=tap-notification-180637.mp3');

    const CurrentUserName = localStorage.getItem(storageUsernameKey);
    console.log(CurrentUserName);

    // Fetch initial chat messages for the room
    const fetchMessages = () => {
        ChatDS.getMessages(roomId)
            .then((response) => {
                setMessages(response.data);
                console.log("Initial messages fetched:", response.data);
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
        const wsUrl = `ws://localhost:8000/ws/rooms/${roomId}/chat/?token=${token}`;
        const ws = new WebSocket(wsUrl);
        webSocketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("WebSocket message received:", data);
            
            if (data.message) {
                // Play notification sound for new messages
                notificationSound.play().catch(err => console.error('Error playing sound:', err));
                
                // Append the new message to the existing messages
                // This assumes the backend is sending complete message objects
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
    }, [roomId, notificationSound]);

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
        
        // Note: We don't manually add the message to the state
        // as we'll receive it back via the WebSocket once it's processed
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
        <Paper
            sx={{
                padding: "1rem",
                backgroundColor: "#fff9c4",
                minHeight: "800px",
                maxHeight: "800px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Chat
            </Typography>
            <Box
                ref={chatContainerRef}
                className="chat-container"
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    overflowX: "hidden", // Prevent horizontal scrolling
                    marginBottom: "1rem",
                    maxHeight: "800px",
                    scrollbarWidth: "thin",
                }}
            >
                {messages.map((message) => (
                    <Box key={message.id} display="flex" alignItems="flex-start" sx={{ marginBottom: "0.5rem" }}>
                        <Avatar
                            src={message.sender.profile_picture}
                            sx={{ width: 40, height: 40, marginRight: "0.5rem" }}
                        />
                        <Box sx={{ wordBreak: "break-word", flexGrow: 1 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle2">{message.sender.username}</Typography>
                                {message.sender.username === CurrentUserName && (
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteMessage(roomId, message.id)}
                                        sx={{
                                            padding: "4px",
                                            "&:hover": { color: "error.main" },
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Typography variant="body2">{message.content}</Typography>
                            <Typography variant="caption">
                                {new Date(message.created_at).toLocaleTimeString()}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box display="flex">
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button variant="contained" onClick={handleSendMessage} sx={{ marginLeft: "0.5rem" }}>
                    Send
                </Button>
            </Box>
        </Paper>
    );
}
