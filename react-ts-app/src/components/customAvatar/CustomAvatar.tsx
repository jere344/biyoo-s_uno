import React, { useState } from "react";
import { Avatar, Box, Badge } from "@mui/material";
import { IUser, IPublicUser } from "../../data_interfaces/IUser";
import { applyAvatarEffect } from "./effectLibrary/index";

interface CustomAvatarProps {
    user: IUser | IPublicUser | null;
    size?: number;
    showOnlineStatus?: boolean;
    onClick?: () => void;
    sx?: any;
}

export const CustomAvatar: React.FC<CustomAvatarProps> = ({ user, size = 40, showOnlineStatus = false, onClick, sx = {} }) => {
    const [isHovered, setIsHovered] = useState(false);

    sx = {
        ...sx,
        width: size,
        height: size,
    };

    // Default profile picture if none is provided
    const profilePicUrl = user?.profile_picture
        ? user?.profile_picture
        : `https://ui-avatars.com/api/?name=${user?.username}&background=random`;

    // Check if user is online (only works with IUser)
    const isOnline = user && "is_online" in user ? user.is_online : false;
    
    // Create the avatar with effect first
    const avatarWithEffect = applyAvatarEffect(
        <Avatar
            src={profilePicUrl}
            alt={user?.username}
            sx={sx}
        />,
        user?.profile_effect,
        isHovered,
        size
    );
    
    return (
        <Box
            style={{ display: "inline-flex", position: "relative" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            sx={{ cursor: onClick ? "pointer" : "default" }}
        >
            <Badge 
                badgeContent="" 
                color="success" 
                overlap="circular"
                anchorOrigin={{ 
                    vertical: "bottom", 
                    horizontal: "right" 
                }}
                invisible={!showOnlineStatus || !isOnline}
            >
                {avatarWithEffect}
            </Badge>
        </Box>
    );
};

export default CustomAvatar;
