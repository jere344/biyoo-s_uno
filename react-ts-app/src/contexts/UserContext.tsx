import React, { useEffect, useState, ReactNode } from "react";
import { storageAccessTokenKey } from "../data_services/CustomAxios";
import { IUser } from "@DI/IUser";
import { forceRefreshtoken } from "../data_services/CustomAxios";
import { UserContext } from "../contexts/UserContextStore";

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    // Function to establish WebSocket connection
    const connectWebSocket = () => {
        // Close existing socket if any
        if (socket) {
            socket.close();
        }

        // Create new WebSocket connection
        const token = localStorage.getItem(storageAccessTokenKey);
        if (!token) {
            console.log("user is not connected");
            setTimeout(connectWebSocket, 5000);
            return null;
        }
        const wsUrl = `${import.meta.env.VITE_WS_URL}ws/user/?token=${token}`;
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
            console.log("WebSocket connected for user updates");
        };

        newSocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "user_data" || message.type === "user_update") {
                    // Transform snake_case to camelCase for React
                    const userData = message.data;
                    setUser(userData);
                }
            } catch (err) {
                console.error("Error processing WebSocket message:", err);
            }
        };

        newSocket.onclose = (event) => {
            console.log("WebSocket disconnected:", event.code, event.reason);
            if (event.code == 3003) {
                forceRefreshtoken().then(() => {
                    connectWebSocket();
                });
                return;
            }

            console.log(`Reconnecting in 5000ms`);
            setTimeout(connectWebSocket, 5000);

        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
            newSocket.close();
        };

        setSocket(newSocket);
    };

    // Initialize: fetch user data and establish WebSocket connection
    useEffect(() => {
        connectWebSocket();

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const value = {
        user,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
