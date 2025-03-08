import { Outlet } from "react-router-dom";
import { Avatar, Box, Container } from "@mui/material";


function AuthContainer() {
  const profilePicture = localStorage.getItem("profilePicture");
  return (
    <Container component="main" maxWidth="xs" sx={{ marginY: 3 }}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Avatar sx={{ bgcolor: "secondary.main", m: 1 }} src={profilePicture}
        />
        <Outlet />
      </Box>
    </Container>
  );
}

export default AuthContainer;
