import { useState } from "react";
import { Grid2, Typography, Paper, Switch, FormControlLabel } from "@mui/material";
import PlayingCard from "./PlayingCard";
import PlayingCardSide from "./PlayingCardSide";

type MemoryGameSettingsProps = {
  resetGame: (size: [number, number]) => void;
  gameSize: [number, number];
  setCardBgColor: (color: string) => void;
  showTimer: boolean;
  setShowTimer: (show: boolean) => void;
};

export default function MemoryGameSettings({
  resetGame,
  setCardBgColor,
  gameSize,
  showTimer,
  setShowTimer,
}: MemoryGameSettingsProps) {
  const availableCardBgColor = ["ghostwhite", "lightblue", "lightgreen", "lightpink"];
  const [gameSizeOptions] = useState([
    [4, 3],
    [4, 4],
    [5, 4],
    [6, 4],
    [6, 5],
    [6, 6],
  ]);

  return (
    <Paper style={{ padding: "1rem", marginTop: "1rem", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Paramètres
      </Typography>
      {/* Timer Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={showTimer}
            onChange={(e) => setShowTimer(e.target.checked)}
            color="primary"
          />
        }
        label="Afficher le Timer"
      />
      <Typography color="primary" variant="h6" sx={{ marginBottom: "2rem", marginTop: "1rem" }}>
        Choisissez une couleur de cartes :
      </Typography>
      <Grid2 container spacing={2} justifyContent="center">
        {availableCardBgColor.map((color) => (
          <Grid2 key={color} size={{ xs: 3 }}>
            <PlayingCard
              card={{ id: color, emoji: "", flipped: false, matched: false }}
              onSelect={() => setCardBgColor(color)}
              bgColor={color}
            />
          </Grid2>
        ))}
      </Grid2>
      <Typography color="primary" variant="h6" sx={{ marginTop: "2rem" }}>
        Choisissez la taille du jeu :
      </Typography>
      <Grid2 container spacing={2} justifyContent="center">
        {gameSizeOptions.map((size) => (
          <Grid2 key={size} size={{ xs: 3 }}>
            <PlayingCardSide
              emoji={`${size[0]} x ${size[1]}`}
              onClick={() => 
              {
                resetGame(size);
              }
              }
              bgColor={gameSize[0] === size[0] && gameSize[1] === size[1] ? "lightgrey" : "ghostwhite"}
            />
          </Grid2>
        ))}
      </Grid2>
    </Paper>
  );
}
