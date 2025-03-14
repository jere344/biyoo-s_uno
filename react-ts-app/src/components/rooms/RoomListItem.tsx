import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Box,
  Tooltip,
  Button,
  Typography,
  Chip,
  LinearProgress,
  Badge,
} from "@mui/material";
import { motion } from "framer-motion";
import IRoom from "../../interfaces/IRoom";
import RoomDS from "../../data_services/RoomDS";
import { useNavigate } from "react-router-dom";
import { useRoom } from "../../hooks/useRoom";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

type RoomProps = {
  room: IRoom;
};

// More vibrant colors to match the game style
const colors = [
  "linear-gradient(135deg, #FF5252 0%, #FF1744 100%)",  // Red
  "linear-gradient(135deg, #D500F9 0%, #AA00FF 100%)",  // Purple
  "linear-gradient(135deg, #2979FF 0%, #2962FF 100%)",  // Blue
  "linear-gradient(135deg, #00E676 0%, #00C853 100%)",  // Green
  "linear-gradient(135deg, #FFAB00 0%, #FF6D00 100%)",  // Orange
  "linear-gradient(135deg, #1DE9B6 0%, #00BFA5 100%)",  // Teal
  "linear-gradient(135deg, #76FF03 0%, #64DD17 100%)",  // Lime
  "linear-gradient(135deg, #FF4081 0%, #F50057 100%)",  // Pink
  "linear-gradient(135deg, #FFEA00 0%, #FFD600 100%)",  // Yellow
  "linear-gradient(135deg, #5C6BC0 0%, #3949AB 100%)",  // Indigo
];

export default function RoomListItem({ room }: RoomProps) {
  const [color, setColor] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { joinRoom } = useRoom();
  
  const occupancyPercentage = (room.users.length / room.player_limit) * 100;
  const isRoomFull = room.users.length >= room.player_limit;
  
  // Format creation time
  const createdAt = new Date(room.created_at);
  const timeAgo = getTimeAgo(createdAt);

  useEffect(() => {
    // Pick a color based on room id to ensure consistency
    const colorIndex = room.id % colors.length;
    setColor(colors[colorIndex]);
  }, [room.id]);

  const handleJoinRoom = () => {
    setIsJoining(true);
    RoomDS.join(room.id).then((response) => {
      joinRoom(room.id);
      navigate(`/room/${response.data.id}`);
    }).catch(() => {
      setIsJoining(false);
    });
  };
  
  // Helper function to format time ago
  function getTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " ans";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mois";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " jours";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " heures";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";
    
    return Math.floor(seconds) + " secondes";
  }
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -5,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ marginBottom: "1.5rem" }}
    >
      <Card 
        sx={{ 
          background: color,
          borderRadius: "16px",
          boxShadow: hovered 
            ? "0 15px 30px rgba(0,0,0,0.4), 0 0 15px rgba(255,255,255,0.2)"
            : "0 8px 20px rgba(0,0,0,0.2)",
          transition: "box-shadow 0.3s ease",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          overflow: "visible",
          position: "relative",
        }}
      >
        {/* Room Status Badge */}
        <Box 
          sx={{ 
            position: "absolute", 
            top: "-12px", 
            right: "20px", 
            zIndex: 10 
          }}
        >
          <Chip
            icon={isRoomFull ? <PersonAddDisabledIcon /> : <PersonAddIcon />}
            label={isRoomFull ? "Complet" : "Disponible"}
            sx={{
              backgroundColor: isRoomFull ? "#b71c1c" : "#2e7d32",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "20px",
              padding: "3px 10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              border: "2px solid rgba(255,255,255,0.3)"
            }}
          />
        </Box>

        <CardHeader
          title={
            <motion.div
              animate={hovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "white", 
                  fontWeight: 700,
                  textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SportsEsportsIcon sx={{ mr: 1 }} /> {room.name}
              </Typography>
            </motion.div>
          }
          subheader={
            <Box sx={{ mt: 1 }}>
              <Chip
                icon={<AccessTimeIcon sx={{ color: "rgba(255,255,255,0.9) !important" }} />}
                label={`Créée il y a ${timeAgo}`}
                sx={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "rgba(255,255,255,0.9)",
                  marginRight: 1,
                  marginBottom: 1
                }}
                size="small"
              />
            </Box>
          }
        />
        
        <CardContent>
          <Box 
            sx={{ 
              backgroundColor: "rgba(0,0,0,0.15)", 
              borderRadius: "12px", 
              padding: 2,
              marginBottom: 2
            }}
          >
            {/* Player capacity indicator */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PeopleIcon sx={{ color: "rgba(255,255,255,0.9)", mr: 1 }} />
              <Typography sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                Joueurs: {room.users.length} / {room.player_limit}
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={occupancyPercentage}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: isRoomFull ? '#b71c1c' : '#4caf50',
                  borderRadius: 5,
                },
              }}
            />
            
            {/* Player avatars */}
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {room.users.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Tooltip title={user.username} arrow placement="top">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: '#4caf50',
                            border: '2px solid white',
                          }}
                        />
                      }
                    >
                      <Avatar 
                        src={user.profile_picture} 
                        sx={{ 
                          width: 50, 
                          height: 50,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                          border: "2px solid rgba(255,255,255,0.8)"
                        }}
                      />
                    </Badge>
                  </Tooltip>
                </motion.div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: room.player_limit - room.users.length }, (_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 50, 
                      height: 50, 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '2px dashed rgba(255,255,255,0.3)'
                    }} 
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained" 
                onClick={handleJoinRoom}
                disabled={isRoomFull || isJoining}
                startIcon={isRoomFull ? <LockIcon /> : <LoginIcon />}
                sx={{
                  background: isRoomFull 
                    ? "rgba(0,0,0,0.3)" 
                    : "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  boxShadow: isRoomFull ? "none" : "0 4px 15px rgba(25, 118, 210, 0.5)",
                  textTransform: "uppercase",
                  border: "2px solid rgba(255,255,255,0.2)"
                }}
              >
                {isJoining ? "En cours..." : (isRoomFull ? "Complet" : "Rejoindre")}
              </Button>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}
