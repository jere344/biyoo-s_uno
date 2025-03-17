import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoomDS from "../../data_services/RoomDS";

export default function CreateRoomView() {
  const [newRoomName, setNewRoomName] = useState("");
  const [playerLimit, setPlayerLimit] = useState(2); // New state for player limit
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!newRoomName.trim() || playerLimit < 2 || playerLimit > 8) return;
    try {
      await RoomDS.create({
        name: newRoomName, player_limit: playerLimit,
        id: 0,
        users: [],
        is_open: false,
        created_at: ""
      }); // Updated create call
      navigate("/"); // Navigate back to the room list page after creation
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginY: "1rem" }}>
      <Paper sx={{ padding: "1rem", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Créer une nouvelle salle
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Nom de la salle"
          fullWidth
          variant="standard"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Limite de joueurs"
          type="number"
          fullWidth
          variant="standard"
          value={playerLimit}
          onChange={(e) => setPlayerLimit(Number(e.target.value))}
          inputProps={{ min: 2, max: 8 }}
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!newRoomName.trim() || playerLimit < 2 || playerLimit > 8}
          sx={{ marginTop: "1rem" }}
        >
          Créer
        </Button>
      </Paper>
    </Container>
  );
}
