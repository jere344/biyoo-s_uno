import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./assets/css/main.css";
import App from "./components/App";
import AuthContainer from "./components/auth/AuthContainer";
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
import { RoomProvider } from "./contexts/RoomContext";
import { UserProvider } from "./contexts/UserContext";
import Home from "./components/Home";
import Shop from "./components/shop/Shop";
import Leaderboard from "./components/Leaderboard";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <UserProvider>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route path="" element={<Home />} />
                        <Route path="create-room" element={<CreateRoomView />} />
                        <Route path="room/:id" element={<Room />} />
                        <Route path="shop" element={<Shop />} />
                        <Route path="leaderboard" element={<Leaderboard />} />

                        <Route path="login" element={<LoginView />} />
                        <Route path="signup" element={<SignUpView />} />
                        <Route path="" element={<ProtectedRoutes />}>
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
    </StrictMode>
);
