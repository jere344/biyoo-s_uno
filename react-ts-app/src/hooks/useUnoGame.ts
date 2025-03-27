import { useContext } from "react";
import { UnoGameContext } from "../contexts/UnoGameContext";

export const useUnoGame = () => {
    const context = useContext(UnoGameContext);
    if (context === null) {
        throw new Error("useUnoGame must be used within a UnoGameProvider");
    }
    return context;
};
