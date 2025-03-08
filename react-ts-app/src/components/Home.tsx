import { Container, Typography, Paper } from "@mui/material";
import RoomList from "./rooms/RoomList";

export default function Home() {
    return (
        <Container maxWidth="lg" sx={{ marginY: "1rem" }}>
            <Paper style={{ padding: "1rem", textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    <RoomList />
                </Typography>
            </Paper>
        </Container>
    );
}
