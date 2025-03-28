import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./assets/css/main.css";
import App from "./components/App";
import LoginView from "./components/auth/LoginView";
import Logout from "./components/auth/Logout";
import NotFound from "./components/NotFound";
import PasswordEditView from "./components/user/PasswordEditView";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SignUpView from "./components/auth/SignUpView";
import UserEditView from "./components/user/UserEditView";
import UserDeleteView from "./components/user/UserDeleteView";
import CreateRoomView from "./components/rooms/CreateRoomView";
import Room from "./components/rooms/Room";
import RoomInvite from "./components/rooms/RoomInvite";
import { UserProvider } from "./contexts/UserContext";
import Home from "./components/Home";
import Shop from "./components/shop/Shop";
import Leaderboard from "./components/Leaderboard";
import AvatarEffectsShowcase from "./components/customAvatar/AvatarEffectsShowcase.tsx";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route path="" element={<Home />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="avatar-effects" element={<AvatarEffectsShowcase />} />

                        <Route path="login" element={<LoginView />} />
                        <Route path="signup" element={<SignUpView />} />
                        <Route path="" element={<ProtectedRoutes />}>
                            <Route path="room/:id" element={<Room />} />
                            <Route path="create-room" element={<CreateRoomView />} />
                            <Route path="invite/:roomId/:inviteCode" element={<RoomInvite />} />
                            <Route path="shop" element={<Shop />} />
                            <Route path="user-edit/me" element={<UserEditView />} />
                            <Route path="password-edit/me" element={<PasswordEditView />} />
                            <Route path="delete-me" element={<UserDeleteView />} />
                        </Route>
                    </Route>
                    <Route path="logout" element={<Logout />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </UserProvider>
        </BrowserRouter>
    // </StrictMode>
);
