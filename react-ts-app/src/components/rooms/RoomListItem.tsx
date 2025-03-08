import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import IRoom from "../../interfaces/IRoom";
import RoomDS from "../../data_services/RoomDS";

import { useNavigate } from "react-router-dom";
type RoomProps = {
  room: IRoom;
};
const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
];


export default function RoomListItem({ room }: RoomProps) {
  // A static list of colors to choose from.
  const [color, setColor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [room.id]);

  console.log(room);

  const handleJoinRoom = () => {
    RoomDS.join(room.id).then((response) => {
      navigate(`/room/${response.data.id}`);
    });
  };
  
  return (
    <Card sx={{ backgroundColor: color, marginBottom: "1rem" }}>
      <CardHeader
        title={room.name}
        subheader={`Created at: ${new Date(room.created_at).toLocaleString()} | Player limit: ${room.player_limit}`} // Updated subheader
      />
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          {room.users.map((user) => {
            return (
              <Tooltip title={user.username} key={user.id}>
                <Avatar src={user.profile_picture} sx={{ width: 50, height: 50 }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                 />
              </Tooltip>
            );
          })}
          {Array.from({ length: room.player_limit - room.users.length }, (_, i) => (
            <Avatar key={i} sx={{ width: 40, height: 40 }} />
          ))}
        </Box>
        <Button variant="contained" color="secondary" onClick={handleJoinRoom}>
          Join Room
        </Button>
      </CardContent>
    </Card>
  );
}
