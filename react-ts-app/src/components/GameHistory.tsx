import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import GamePlayedDS from "../data_services/GamePlayedDS";
import { IGamePlayed } from "../data_interfaces/IGamePlayed";
import { useNavigate } from "react-router-dom";

export default function GameHistory() {
  const [games, setGames] = useState<IGamePlayed[]>([]);
  const [limit, setLimit] = useState<number>(20);

  const navigate = useNavigate();


  useEffect(() => {
    GamePlayedDS.get(limit).then((data) => {
      const sortedData = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setGames(sortedData);
    });
  }, [limit]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Historique des parties
      </Typography>

      <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
        <MenuItem value={20}>20 dernières parties</MenuItem>
        <MenuItem value={50}>50 dernières parties</MenuItem>
        <MenuItem value={100}>100 dernières parties</MenuItem>
      </Select>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date & Heure</TableCell>
              <TableCell>Niveau</TableCell>
              <TableCell>Durée (s)</TableCell>
              <TableCell>Nombre d'essais</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  {new Date(game.created_at).toLocaleString("fr-FR")}
                </TableCell>
                <TableCell>{game.game_level}</TableCell>
                <TableCell>{game.game_duration}</TableCell>
                <TableCell>{game.game_tries}</TableCell>
                <TableCell>{game.game_score}</TableCell>
                <TableCell>
                  {game.game_finished ? "Complétée" : "Non complétée"}
                </TableCell>
                  { !game.game_finished && game.game_state != null ? 
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/memory-game?continue=${game.id}`)}
                    >
                      Continuer
                    </Button>
                  </TableCell>
                  : null }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};