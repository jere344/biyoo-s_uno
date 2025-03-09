import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Button, TextField, IconButton, Box, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import { IRoom } from "../../interfaces/IRoom";
import RoomDS from "../../data_services/RoomDS";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
// import Chat from "./Chat";
import UnoGame from "./UnoGame";

export default function Room() {
    const { id } = useParams();
    const [room, setRoom] = useState<IRoom>({
        id: 0,
        name: "",
        is_open: true,
        player_limit: 2,
        users: [],
    });

    const navigate = useNavigate();

    useEffect(() => {
        RoomDS.getOne(parseInt(id, 10))
            .then((response) => {
                setRoom(response.data);
            })
            .catch((error) => {
                console.error("Error fetching room:", error);
                navigate("/");
            });
    }, [navigate, id]);

    const [editingName, setEditingName] = useState(false);
    const [newRoomName, setNewRoomName] = useState(room.name);

    const handleNameEditToggle = () => {
        setEditingName(!editingName);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewRoomName(event.target.value);
    };

    const handleNameSave = () => {
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
        RoomDS.update(room.id, { player_limit: value })
            .then((response) => {
                setRoom(response.data);
            })
            .catch((error) => {
                console.error("Error updating player limit:", error);
            });
    };

    const handleLeaveRoom = () => {
        RoomDS.leave(room)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Error leaving room:", error);
            });
    };

    return (
        <Container sx={{ marginY: "2rem" }} maxWidth={false}>
            <Paper
                sx={{
                    padding: "1rem",
                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    color: "white",
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    {editingName ? (
                        <TextField
                            value={newRoomName}
                            onChange={handleNameChange}
                            variant="outlined"
                            size="small"
                            sx={{ backgroundColor: "white", borderRadius: 1 }}
                        />
                    ) : (
                        <Typography variant="h4">{room.name}</Typography>
                    )}
                    <Box>
                        {editingName ? (
                            <IconButton onClick={handleNameSave} sx={{ color: "white" }}>
                                <SaveIcon />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleNameEditToggle} sx={{ color: "white" }}>
                                <EditIcon />
                            </IconButton>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleToggleRoomStatus}
                            sx={{
                                marginX: "0.5rem",
                                backgroundColor: room.is_open ? "#4caf50" : "#f44336",
                            }}
                        >
                            {room.is_open ? (
                                <>
                                    <LockOpenIcon sx={{ marginRight: "0.3rem" }} />
                                    Ouverte
                                </>
                            ) : (
                                <>
                                    <LockIcon sx={{ marginRight: "0.3rem" }} />
                                    Fermée
                                </>
                            )}
                        </Button>
                        <TextField
                            type="number"
                            label="Player Limit"
                            value={room.player_limit}
                            onChange={handlePlayerLimitChange}
                            size="small"
                            sx={{ backgroundColor: "white", borderRadius: 1 }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleLeaveRoom}
                            sx={{ marginX: "0.5rem" }}
                        >
                            Quitter la salle
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Main content with players list, game area, and chat */}
            <Grid container spacing={2} sx={{ marginTop: "1rem" }}>
                {/* Players List */}
                <Grid item xs={12}>
                    <Paper sx={{ padding: "1rem", backgroundColor: "#e0f7fa" }} >
                        <Box display="flex" flexWrap="wrap" alignItems="center">
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                Joueurs ({room.users.length}/{room.player_limit})
                            </Typography>
                            {room.users.map((user) => (
                                <Box key={user.id} display="flex" alignItems="center" sx={{ marginRight: "1rem", marginBottom: "0.5rem" }}>
                                    <Avatar src={user.profile_picture} sx={{ width: 50, height: 50 }} />
                                    <Typography variant="body1" sx={{ marginLeft: "0.5rem" }}>
                                        {user.username}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Center: Game Area */}
                <Grid item xs={12} md={8}>
                    <UnoGame />
                </Grid>

                {/* Right: Chat Area */}
                <Grid item xs={12} md={4}>
                    {/* <Chat /> */}
                </Grid>
            </Grid>
        </Container>
    );
}
