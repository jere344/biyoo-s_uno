import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
    Avatar,
} from "@mui/material";
import {
    InfoOutlined as InfoOutlinedIcon,
    Logout as LogoutIcon,
    PersonOutlineOutlined as PersonOutlineOutlinedIcon,
} from "@mui/icons-material";
import CustomAvatar from "./customAvatar/CustomAvatar";
import { useUser } from "../hooks/useUser";
import { motion } from "framer-motion";

function BannerUserMenu(): React.JSX.Element {
    const { user } = useUser();
    const navigate: NavigateFunction = useNavigate();
    const [aboutOpen, setAboutOpen] = useState(false);
    const [userAnchorEl, setUserAnchorEl] = useState<HTMLElement | null>(null);
    const profilePicture = localStorage.getItem("profilePicture");

    const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
        setUserAnchorEl(e.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setUserAnchorEl(null);
    };

    const handleOpenAbout = (): void => {
        setUserAnchorEl(null);
        setAboutOpen(true);
    };

    const handleCloseAbout = (): void => {
        setAboutOpen(false);
    };

    const handleUserEditClick = (): void => {
        setUserAnchorEl(null);
        navigate("/user-edit/me/");
    };

    const handleLogoutClick = (): void => {
        setUserAnchorEl(null);
        navigate("/logout/");
    };

    return (
        <>
            <Box>
                <Tooltip title={"Ouvrir le menu utilisateur"}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                            aria-controls="user-menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleOpenUserMenu}
                            sx={{ 
                                p: 0.5,
                                border: "2px solid rgba(255,255,255,0.2)",
                                backgroundColor: "rgba(255,255,255,0.1)",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.2)",
                                },
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                            }}
                        >
                            {
                                user?.profile_picture ? (
                                    <CustomAvatar user={user} size={40} showOnlineStatus={true} />
                                ) : (
                                    <Avatar 
                                        alt="Profile picture" 
                                        src={profilePicture} 
                                        sx={{ 
                                            bgcolor: "secondary.main",
                                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                                        }}
                                    />
                                )
                            }
                        </IconButton>
                    </motion.div>
                </Tooltip>
                <Menu
                    anchorEl={userAnchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    id="user-menu-appbar"
                    keepMounted
                    onClose={handleCloseUserMenu}
                    open={Boolean(userAnchorEl)}
                    sx={{ 
                        mt: "45px",
                        "& .MuiPaper-root": {
                            borderRadius: "12px",
                            minWidth: "200px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                            background: "linear-gradient(145deg, #2A3990 0%, #3949ab 100%)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            overflow: "hidden"
                        }
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    PaperProps={{
                        component: motion.div,
                        initial: { opacity: 0, y: -20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.2 }
                    }}
                >
                    {user?.username && (
                        <MenuItem 
                            onClick={handleUserEditClick} 
                            sx={{ 
                                py: "8px",
                                color: "white",
                                "&:hover": {
                                    background: "rgba(255,255,255,0.1)"
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                <PersonOutlineOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography sx={{ 
                                    fontSize: "0.95rem",
                                    fontWeight: "bold",
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
                                }}>
                                    {user?.username}
                                </Typography>
                            </ListItemText>
                        </MenuItem>
                    )}
                    <MenuItem 
                        onClick={handleOpenAbout} 
                        sx={{ 
                            py: "8px",
                            color: "white",
                            "&:hover": {
                                background: "rgba(255,255,255,0.1)"
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: "white" }}>
                            <InfoOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ 
                                fontSize: "0.95rem",
                                fontWeight: "medium",
                                textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
                            }}>
                                {"À propos"}
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    <MenuItem 
                        onClick={handleLogoutClick} 
                        sx={{ 
                            py: "8px",
                            color: "#FF9800",
                            "&:hover": {
                                background: "rgba(255,152,0,0.1)"
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: "#FF9800" }}>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography sx={{ 
                                fontSize: "0.95rem",
                                fontWeight: "medium",
                                textShadow: "1px 1px 2px rgba(0,0,0,0.2)"
                            }}>
                                {"Se déconnecter"}
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
            <Dialog
                aria-describedby="about-dialog-description"
                aria-labelledby="about-dialog-title"
                onClose={handleCloseAbout}
                open={aboutOpen}
                PaperProps={{
                    component: motion.div,
                    initial: { opacity: 0, y: 20, scale: 0.9 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    transition: { duration: 0.3 },
                    sx: {
                        borderRadius: "16px",
                        background: "linear-gradient(145deg, #1a237e 0%, #3949ab 100%)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                        minWidth: "350px"
                    }
                }}
            >
                <DialogTitle id="about-dialog-title" sx={{ 
                    fontSize: "1.5rem", 
                    fontWeight: "bold",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.3)"
                }}>
                    À propos
                </DialogTitle>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                <DialogContent>
                    <DialogContentText id="about-dialog-description" variant="body2" textAlign="justify" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        Rogatus ad ultimum admissusque in consistorium ambage nulla praegressa inconsiderate et leviter
                        proficiscere inquit ut praeceptum est, Caesar sciens quod si cessaveris, et tuas et palatii tui
                        auferri iubebo prope diem annonas. hocque solo contumaciter dicto subiratus abscessit nec in
                        conspectum eius postea venit saepius arcessitus.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 3, pr: 3 }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                            autoFocus 
                            color="primary" 
                            onClick={handleCloseAbout} 
                            size="medium" 
                            variant="contained"
                            sx={{
                                background: "linear-gradient(45deg, #FF9800 30%, #FF5722 90%)",
                                borderRadius: "20px",
                                padding: "8px 20px",
                                fontWeight: "bold",
                                textTransform: "none",
                                boxShadow: "0 3px 10px rgba(255, 152, 0, 0.4)",
                            }}
                        >
                            OK
                        </Button>
                    </motion.div>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default BannerUserMenu;
