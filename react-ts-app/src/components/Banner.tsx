import { NavigateFunction, useNavigate } from "react-router-dom";
import { storageAccessTokenKey } from "../data_services/CustomAxios";
import {
  AppBar,
  Container,
  IconButton,
  Link,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import BannerUserMenu from "./BannerUserMenu";
import { useRoom } from "../contexts/RoomContext";

function Banner() {
  const navigate: NavigateFunction = useNavigate();
  const { currentRoomId } = useRoom();

  const handleCartClick = () => {
    navigate("/cart/");
  };

  const handleFavoriteProductClick = (): void => {
    navigate("/favorite-products/");
  };

  const handleHomeClick = () => {
    if (currentRoomId) {
      navigate(`/room/${currentRoomId}`);
    } else {
      navigate("/");
    }
  };

  const handleLoginClick = () => {
    navigate("/login/");
  };

  return (
    <AppBar position="fixed">
      <Container component="nav" disableGutters={true} maxWidth={false}>
        <Toolbar>
          <Link
            color="inherit"
            onClick={handleHomeClick}
            sx={{ cursor: "pointer", flexGrow: 1, textDecoration: "none" }}
          >
            <Typography variant="h6">Biyoo's Uno</Typography>
          </Link>
          {localStorage.getItem(storageAccessTokenKey) ? (
            <>
              <Tooltip sx={{ mr: 2 }} title={"Afficher vos produits favoris"}>
                <IconButton
                  color="inherit"
                  onClick={handleFavoriteProductClick}
                  size="small"
                >
                </IconButton>
              </Tooltip>
              <Tooltip sx={{ mr: 3 }} title={"Afficher le panier"}>
                <IconButton
                  color="inherit"
                  onClick={handleCartClick}
                  size="small"
                >
                </IconButton>
              </Tooltip>
              <BannerUserMenu />
            </>
          ) : (
            <Link
              color="inherit"
              onClick={handleLoginClick}
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
