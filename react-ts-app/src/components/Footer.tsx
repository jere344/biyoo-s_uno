import React from "react";
import { Box, Container, Typography, Grid, IconButton, Link, Divider, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import GitHubIcon from "@mui/icons-material/GitHub";
import CasinoIcon from "@mui/icons-material/Casino";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useNavigate } from "react-router-dom";

function Footer() {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    return (
        <Box
            component="footer"
            sx={{
                background: "linear-gradient(to top, #1a237e 0%, #3949ab 100%)",
                color: "white",
                paddingY: 4,
                marginTop: 0,
                position: "relative",
                boxShadow: "0px -5px 20px rgba(0, 0, 0, 0.2)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                        "linear-gradient(90deg, #FF9800, #FF5722, #9C27B0, #673AB7, #3F51B5, #2196F3, #03A9F4, #00BCD4, #009688, #4CAF50)",
                    backgroundSize: "1000% 100%",
                    animation: "rainbow 15s linear infinite",
                },
                "@keyframes rainbow": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "100%": { backgroundPosition: "100% 50%" },
                },
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
                            >
                                <CasinoIcon sx={{ fontSize: 40, mr: 1, color: "#FF9800" }} />
                            </motion.div>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    background: "linear-gradient(45deg, #FF9800 30%, #FF5722 90%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    letterSpacing: "1px",
                                }}
                            >
                                Biyoo's Uno
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                opacity: 0.8,
                                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                            }}
                        >
                            Un jeu de cartes multijoueur inspiré par le célèbre jeu Uno. Défiez vos amis et devenez le
                            champion !
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#BBDEFB" }}>
                            Navigation
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <Link
                                    onClick={() => navigate("/")}
                                    color="inherit"
                                    underline="hover"
                                    sx={{ display: "flex", alignItems: "center" }}
                                >
                                    <CardGiftcardIcon sx={{ mr: 1, fontSize: "small" }} />
                                    <Typography variant="body1">Accueil</Typography>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <Link
                                    onClick={() => navigate("/shop")}
                                    color="inherit"
                                    underline="hover"
                                    sx={{ display: "flex", alignItems: "center" }}
                                >
                                    <CardGiftcardIcon sx={{ mr: 1, fontSize: "small" }} />
                                    <Typography variant="body1">Boutique</Typography>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <Link
                                    onClick={() => navigate("/login")}
                                    color="inherit"
                                    underline="hover"
                                    sx={{ display: "flex", alignItems: "center" }}
                                >
                                    <CardGiftcardIcon sx={{ mr: 1, fontSize: "small" }} />
                                    <Typography variant="body1">Connexion</Typography>
                                </Link>
                            </motion.div>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#BBDEFB" }}>
                            Contact & Liens
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
                                <Tooltip title="GitHub">
                                    <IconButton
                                        component="a"
                                        href="https://github.com/jere344"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: "white",
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                                        }}
                                    >
                                        <GitHubIcon />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
                                <Tooltip title="LinkedIn">
                                    <IconButton
                                        component="a"
                                        href="https://www.linkedin.com/in/j%C3%A9r%C3%A9my-guerin-b9019b255/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: "white",
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                                        }}
                                    >
                                        <LinkedInIcon />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
                                <Tooltip title="Email">
                                    <IconButton
                                        component="a"
                                        href="mailto:jeremy.guerin34@yahoo.com"
                                        sx={{
                                            color: "white",
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                                        }}
                                    >
                                        <EmailIcon />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >	
					<Tooltip title="Ce contenu est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer avec attribution.">
						<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
							&copy; {currentYear} Biyoo's Uno. Open source under MIT license.
						</Typography>
					</Tooltip>

                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                            href="https://github.com/jere344"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: "rgba(255,255,255,0.7)",
                                textDecoration: "none",
                                "&:hover": { color: "white" },
                            }}
                        >
                            <GitHubIcon sx={{ fontSize: 18, mr: 0.5 }} />
                            <Typography variant="body2">github.com/jere344</Typography>
                        </Link>
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;
