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
        fontFamily: "BiyooUnoFont, sans-serif",
        fontSize: 18,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
    components: {
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
