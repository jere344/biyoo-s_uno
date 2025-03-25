import React from "react";
import IGameEnvironmentInventory from "@DI/IGameEnvironmentInventory";
import { 
  Grid, 
  Card, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip,
  Container
} from "@mui/material";
import { motion } from "framer-motion";
import CollectionsIcon from "@mui/icons-material/Collections";

interface GameEnvironmentYourCollectionProps {
    inventory: IGameEnvironmentInventory[];
    activateEnvironment: (id: number) => void;
}

const GameEnvironmentYourCollection: React.FC<GameEnvironmentYourCollectionProps> = ({
    inventory,
    activateEnvironment,
}) => {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                <CollectionsIcon sx={{ fontSize: 32, marginRight: 2, color: "#a29bfe" }} />
                <Typography
                    variant="h5"
                    sx={{
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                    }}
                >
                    Votre Collection
                </Typography>
            </Box>
            
            {inventory.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                        You don't have any environments yet. Visit the shop to get started!
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {inventory.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <Card 
                                    sx={{ 
                                        height: '220px',
                                        position: 'relative',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: item.is_active ? '0 0 0 2px #2196f3, 0 6px 10px rgba(0,0,0,0.15)' : '0 6px 10px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="220"
                                        image={item.game_environment.image}
                                        alt={item.game_environment.name}
                                    />
                                    
                                    {/* Top gradient overlay for name */}
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '80px',
                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                        padding: '16px',
                                        display: 'flex',
                                        alignItems: 'flex-start'
                                    }}>
                                        <Typography 
                                            variant="h6" 
                                            component="h3"
                                            sx={{ 
                                                color: 'white',
                                                textShadow: '0 1px 3px rgba(0,0,0,0.6)'
                                            }}
                                        >
                                            {item.game_environment.name}
                                        </Typography>
                                    </Box>
                                    
                                    {/* Bottom gradient overlay for button */}
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '80px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                                        padding: '16px',
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center'
                                    }}>
                                        <Button
                                            variant={item.is_active ? "outlined" : "contained"}
                                            color="primary"
                                            disabled={item.is_active}
                                            onClick={() => activateEnvironment(item.id)}
                                            size="medium"
                                        >
                                            Activer
                                        </Button>
                                    </Box>
                                    
                                    {item.is_active && (
                                        <Chip
                                            label="Actif"
                                            color="primary"
                                            size="small"
                                            sx={{ 
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                            }}
                                        />
                                    )}
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default GameEnvironmentYourCollection;
