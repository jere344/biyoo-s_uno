import React from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
import { motion } from "framer-motion";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

interface AvatarEffectsProps {
  userCardsCurrency: number;
}

const AvatarEffects: React.FC<AvatarEffectsProps> = ({ userCardsCurrency }) => {
  // Placeholder data - replace with actual data from API when implemented
  const placeholderEffects = [
    {
      id: 1,
      name: "Flammes",
      image: "https://placehold.co/300x300?text=Fire+Effect",
      price: 150,
      description: "Un effet de flammes autour de votre avatar",
    },
    {
      id: 2,
      name: "Halo doré",
      image: "https://placehold.co/300x300?text=Golden+Halo",
      price: 200,
      description: "Un halo doré au-dessus de votre avatar",
    },
    {
      id: 3,
      name: "Aura mystique",
      image: "https://placehold.co/300x300?text=Mystic+Aura",
      price: 175,
      description: "Une aura mystique entourant votre avatar",
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
        <AutoFixHighIcon sx={{ fontSize: 32, marginRight: 2, color: "#e040fb" }} />
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Effets pour Avatar
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {placeholderEffects.map((effect) => (
          <Grid item xs={12} sm={6} md={4} key={effect.id}>
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
                  background: "linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  borderRadius: "15px",
                  overflow: "visible",
                  position: "relative",
                }}
              >
                <Box sx={{ padding: 3 }}>
                  <CardMedia
                    component="img"
                    alt={effect.name}
                    height="210"
                    image={effect.image}
                    title={effect.name}
                    sx={{
                      objectFit: "contain",
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
                    {effect.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    {effect.description}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="contained"
                        disabled={userCardsCurrency < effect.price}
                        startIcon={<AutoFixHighIcon />}
                        sx={{
                          background: "linear-gradient(45deg, #ab47bc 30%, #8e24aa 90%)",
                          color: "white",
                          fontWeight: "bold",
                          padding: "10px 20px",
                          borderRadius: "25px",
                          boxShadow: "0 4px 20px rgba(156, 39, 176, 0.5)",
                          textTransform: "uppercase",
                          border: "2px solid rgba(255,255,255,0.3)",
                          opacity: userCardsCurrency < effect.price ? 0.6 : 1,
                        }}
                      >
                        Acheter ({effect.price} cartes)
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
          Fonctionnalité à venir prochainement ! Ces effets seront visibles autour de votre avatar pendant les parties.
        </Typography>
      </Box>
    </Box>
  );
};

export default AvatarEffects;
