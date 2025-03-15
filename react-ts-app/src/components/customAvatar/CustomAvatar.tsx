import React, { useState } from "react";
import { Avatar, Box, Badge } from "@mui/material";
import { IUser, IPublicUser } from "../../data_interfaces/IUser";
import { applyAvatarEffect } from "./CustomAvatarEffects";

interface CustomAvatarProps {
    user: IUser | IPublicUser;
    size?: number;
    showOnlineStatus?: boolean;
    onClick?: () => void;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({ user, size = 40, showOnlineStatus = false, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Default profile picture if none is provided
    const profilePicUrl = user.profile_picture
        ? user.profile_picture
        : `https://ui-avatars.com/api/?name=${user.username}&background=random`;

    // Check if user is online (only works with IUser)
    const isOnline = "is_online" in user ? user.is_online : false;

    return (
        <Box
            style={{ display: "inline-flex", position: "relative", }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            sx={{ cursor: onClick ? "pointer" : "default" }}
        >
            {applyAvatarEffect(
                <Badge 
                    badgeContent="" color="success" overlap="circular"
                    anchorOrigin={{ 
                        vertical: "bottom", 
                        horizontal: "right" 
                    }}
                    invisible={!showOnlineStatus || !isOnline}
                >
                    <Avatar
                        src={profilePicUrl}
                        alt={user.username}
                        style={{ border: "2px solid white",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"}}
                        sx={{ width: size, height: size }}
                    />
                </Badge>,
                user.profile_effect,
                isHovered,
                size
            )}
        </Box>
    );
};

export default CustomAvatar;
