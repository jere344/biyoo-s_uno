import { useContext } from "react";
import { RoomContext, IRoomContextType } from "../contexts/RoomContextStore";

export const useRoom = (): IRoomContextType => {
    const context = useContext(RoomContext);
    if (context === undefined) {
        throw new Error("useRoom must be used within a RoomProvider");
    }
    return context;
};
