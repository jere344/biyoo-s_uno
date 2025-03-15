import React, { useEffect, useState, ReactNode, useRef } from "react";
import { storageAccessTokenKey } from "../data_services/CustomAxios";
import { IUser } from "../models/IUser";
import { UserContext } from "../contexts/UserContextStore";

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const reconnectAttemptRef = useRef(0);

    // Function to establish WebSocket connection
    const connectWebSocket = () => {
        // Close existing socket if any
        if (socket) {
            socket.close();
        }

        // Create new WebSocket connection
        const token = localStorage.getItem(storageAccessTokenKey);
        const wsUrl = `${import.meta.env.VITE_WS_URL}ws/user/?token=${token}`;

        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
            console.log("WebSocket connected for user updates");
            reconnectAttemptRef.current = 0; // Reset reconnect attempts on successful connection
        };

        newSocket.onmessage = (event) => {
            console.log("WebSocket message received:", event.data);
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
            // Implement exponential backoff
            reconnectAttemptRef.current += 1;
            const attempt = reconnectAttemptRef.current;
            
            // Calculate exponential delay with a base of 1000ms
            const baseDelay = 1000; // 1 second
            const maxDelay = 30000; // 30 seconds max delay
            const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
            
            console.log(`Reconnecting in ${delay}ms (attempt ${attempt})`);
            // setTimeout(connectWebSocket, delay); // Uncomment to enable reconnect
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
