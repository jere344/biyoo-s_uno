import React from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import LandscapeIcon from "@mui/icons-material/Landscape";

interface GameEnvironmentsProps {
  userCardsCurrency: number;
}

const GameEnvironments: React.FC<GameEnvironmentsProps> = ({ userCardsCurrency }) => {
  // Placeholder data - replace with actual data from API when implemented
  const placeholderEnvironments = [
    {
      id: 1,
      name: "Plage tropicale",
      image: "https://placehold.co/400x200?text=Tropical+Beach",
      price: 250,
      description: "Jouez sur une plage tropicale ensoleillée",
    },
    {
      id: 2,
      name: "Casino Vegas",
      image: "https://placehold.co/400x200?text=Vegas+Casino",
      price: 300,
      description: "L'ambiance d'un casino de Las Vegas",
    },
    {
      id: 3,
      name: "Espace profond",
      image: "https://placehold.co/400x200?text=Deep+Space",
      price: 350,
      description: "Un environnement spatial avec étoiles et nébuleuses",
    },
  ];

  return (
    <Box sx={{ marginBottom: 6 }}>
      <Box
        sx={{
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: "15px 25px",
          borderRadius: "20px 20px 0 0",
          marginBottom: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <LandscapeIcon sx={{ fontSize: 32, marginRight: 2, color: "#26a69a" }} />
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Environnements de jeu
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {placeholderEnvironments.map((env) => (
          <Grid item xs={12} sm={6} md={4} key={env.id}>
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card
                sx={{
                  background: "linear-gradient(135deg, #004d40 0%, #009688 100%)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  borderRadius: "15px",
                  overflow: "visible",
                  position: "relative",
                }}
              >
                <Box sx={{ padding: 3 }}>
                  <CardMedia
                    component="img"
                    alt={env.name}
                    height="180"
                    image={env.image}
                    title={env.name}
                    sx={{
                      objectFit: "cover",
                      borderRadius: "10px",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                    }}
                  />
                </Box>

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                      textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
                    }}
                  >
                    {env.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    {env.description}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="contained"
                        disabled={userCardsCurrency < env.price}
                        startIcon={<LandscapeIcon />}
                        sx={{
                          background: "linear-gradient(45deg, #26a69a 30%, #00796b 90%)",
                          color: "white",
                          fontWeight: "bold",
                          padding: "10px 20px",
                          borderRadius: "25px",
                          boxShadow: "0 4px 20px rgba(0, 121, 107, 0.5)",
                          textTransform: "uppercase",
                          border: "2px solid rgba(255,255,255,0.3)",
                          opacity: userCardsCurrency < env.price ? 0.6 : 1,
                        }}
                      >
                        Acheter ({env.price} cartes)
                      </Button>
                    </motion.div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          textAlign: "center",
          padding: 3,
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: "15px",
          marginTop: 3,
        }}
      >
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Fonctionnalité à venir prochainement ! Choisissez l'arrière-plan et l'environnement de vos parties.
        </Typography>
      </Box>
    </Box>
  );
};

export default GameEnvironments;
