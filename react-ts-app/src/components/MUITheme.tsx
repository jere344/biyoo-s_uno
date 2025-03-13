import { PaletteMode } from "@mui/material";

const getDesignTokens = (mode: PaletteMode) => ({
    

    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // light mode palette
            }
            : {
                // dark mode palette
            }),
    },
    typography: {
        fontFamily: "Games-XvD2, sans-serif",
        fontSize: 18,
    },
    components: {
        MuiAvatar: {
            styleOverrides: {
                root: {
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                        transform: "scale(1.2)",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    transition: "transform 0.2s ease-in-out",
                    "&:hover:not(:disabled)": {
                        transform: "scale(1.1)",
                    },
                },
            },
        },
    },
});

export default getDesignTokens;
