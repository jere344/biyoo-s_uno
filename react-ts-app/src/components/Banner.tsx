import { NavigateFunction, useNavigate } from "react-router-dom";
import { storageAccessTokenKey } from "../data_services/CustomAxios";
import { AppBar, Container, Link, Toolbar, Typography } from "@mui/material";
import BannerUserMenu from "./BannerUserMenu";
import { useRoom } from "../hooks/useRoom";
import { useUser } from "../contexts/UserContext";

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
							<Typography variant="h6" sx={{ flexGrow: 1, marginRight: "1rem" }} align="right">
								{user?.username}
							</Typography>
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
