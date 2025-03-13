import { NavigateFunction, useNavigate } from "react-router-dom";
import { storageAccessTokenKey } from "../data_services/CustomAxios";
import { AppBar, Container, Link, Toolbar, Typography, Box } from "@mui/material";
import BannerUserMenu from "./BannerUserMenu";
import { useRoom } from "../hooks/useRoom";
import { useUser } from "../hooks/useUser";
import cardsCurrencyIcon from "@assets/img/cards_currency.png";

function Banner() {
    const navigate: NavigateFunction = useNavigate();
    const { currentRoomId } = useRoom();
    const { user } = useUser();

    return (
        <AppBar position="fixed">
            <Container component="nav" disableGutters={true} maxWidth={false}>
                <Toolbar>
                    <Link
                        color="inherit"
                        onClick={() => navigate("/")}
                        sx={{ cursor: "pointer", textDecoration: "none", marginRight: "1rem" }}
                    >
                        <Typography variant="h6">Biyoo's Uno</Typography>
                    </Link>
                    {currentRoomId ? (
                        <Link
                            color="inherit"
                            onClick={() => navigate(`/room/${currentRoomId}`)}
                            sx={{ 
                                cursor: "pointer", 
                                textDecoration: "none",
                                flexGrow: 1
                            }}
                        >
                            <Typography variant="h6">Room {currentRoomId}</Typography>
                        </Link>
                    ) : null}
                    {/* user menu */}
                    {localStorage.getItem(storageAccessTokenKey) ? (
                        <>
							<Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "flex-end", marginRight: "1rem" }}>
                                <Typography variant="h6" sx={{ marginRight: "1rem" }}>
                                    {user?.username}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <img 
                                        src={cardsCurrencyIcon} 
                                        alt="Cards Currency" 
                                        style={{ height: "24px", marginRight: "4px" }} 
                                    />
                                    <Typography variant="subtitle1">
                                        {user?.cards_currency || 0}
                                    </Typography>
                                </Box>
                            </Box>
                            <BannerUserMenu />
                        </>
                    ) : (
                        <Link
                            color="inherit"
                            onClick={() => navigate("/login/")}
                            sx={{ cursor: "pointer", textDecoration: "none" }}
                        >
                            Se connecter
                        </Link>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Banner;
