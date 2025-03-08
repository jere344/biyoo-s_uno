import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IRoom from "../../data_interfaces/IRoom";
import RoomDS from "../../data_services/RoomDS";
import RoomListItem from "./RoomListItem";

export default function RoomList() {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const navigate = useNavigate();

  const fetchRooms = () => {
    // if the document is not visible, do not fetch data
    if (document.visibilityState !== "visible") return;
    RoomDS.get().then((response) => {
      setRooms(response.data);
    });
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000000); // Refresh every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  return (
    <Container maxWidth="md" sx={{ marginY: "1rem" }}>
      <Paper sx={{ padding: "1rem", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Salles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateRoom}
          sx={{ marginBottom: "1rem" }}
        >
          créer une salle
        </Button>
        {rooms.map((room) => (
          <RoomListItem key={room.id} room={room} />
        ))}
      </Paper>
    </Container>
  );
}
