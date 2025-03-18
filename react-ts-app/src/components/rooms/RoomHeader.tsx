import React, { useState } from "react";
import {
    Typography,
    Button,
    TextField,
    IconButton,
    Box,
    Tooltip,
    Collapse,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { QRCodeSVG } from "qrcode.react";

import IRoom from "@DI/IRoom";
import RoomDS from "@DS/RoomDS";
import { motion } from "framer-motion";

interface RoomHeaderProps {
    room: IRoom;
    onRoomUpdate: (room: IRoom) => void;
    onLeaveRoom: () => void;
}

export default function RoomHeader({ room, onRoomUpdate, onLeaveRoom }: RoomHeaderProps) {
    const [editingName, setEditingName] = useState(false);
    const [newRoomName, setNewRoomName] = useState(room.name);
    const [showInviteLink, setShowInviteLink] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [qrCodeOpen, setQrCodeOpen] = useState(false);

    // Generate the invite link
    const inviteLink = `${window.location.origin}/invite/${room.id}/${room.invitation_code}`;

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
                onRoomUpdate(response.data);
                setEditingName(false);
            })
            .catch((error) => {
                console.error("Error updating room name:", error);
            });
    };

    const handleToggleRoomStatus = () => {
        RoomDS.update(room.id, { is_open: !room.is_open })
            .then((response) => {
                onRoomUpdate(response.data);
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
                onRoomUpdate(response.data);
            })
            .catch((error) => {
                console.error("Error updating player limit:", error);
            });
    };

    // Handle copying invite link to clipboard
    const handleCopyInviteLink = () => {
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    };

    const handleToggleInviteLink = () => {
        setShowInviteLink(!showInviteLink);
    };

    const handleToggleQrCode = () => {
        setQrCodeOpen(!qrCodeOpen);
    };

    return (
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
                <Grid size={{ xs: 12, md: 8 }}>
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
                                mr: 3,
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

                    {/* Invite Link Section */}
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                        <Button
                            startIcon={<LinkIcon />}
                            endIcon={showInviteLink ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            onClick={handleToggleInviteLink}
                            variant="outlined"
                            size="small"
                            sx={{
                                color: "rgba(255,255,255,0.9)",
                                borderColor: "rgba(255,255,255,0.3)",
                                mr: 2,
                                "&:hover": {
                                    borderColor: "rgba(255,255,255,0.6)",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                },
                            }}
                        >
                            {showInviteLink ? "Masquer le lien" : "Afficher le lien d'invitation"}
                        </Button>

                        <Collapse in={showInviteLink} orientation="horizontal">
                            <TextField
                                value={inviteLink}
                                size="small"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title={copySuccess ? "Copié!" : "Copier le lien"}>
                                                <IconButton
                                                    onClick={handleCopyInviteLink}
                                                    size="small"
                                                    color={copySuccess ? "success" : "default"}
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Afficher le QR Code">
                                                <IconButton onClick={handleToggleQrCode} size="small" sx={{ ml: 0.5 }}>
                                                    <QrCodeIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        backgroundColor: "rgba(255,255,255,0.9)",
                                        borderRadius: "8px",
                                        minWidth: "300px",
                                    },
                                }}
                            />
                        </Collapse>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex", justifyContent: "flex-end", mt: { xs: 2, md: 0 } }}>
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
                                onClick={onLeaveRoom}
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

            <Dialog
                open={qrCodeOpen}
                onClose={handleToggleQrCode}
                fullWidth
                maxWidth="xs"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "16px",
                        padding: "16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Scannez ce QR Code pour rejoindre la salle</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px" }}>
                    <Box
                        sx={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    >
                        <QRCodeSVG value={inviteLink} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}>
                        {inviteLink}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleToggleQrCode}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
