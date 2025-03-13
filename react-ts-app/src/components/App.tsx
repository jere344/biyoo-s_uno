import React from "react";
import { Outlet } from "react-router-dom";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";

import Banner from "./Banner";
import Footer from "./Footer";

import getDesignTokens from "./MUITheme";
import CssBaseline from "@mui/material/CssBaseline";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
    const [mode, setMode] = React.useState<"light" | "dark">(localStorage.getItem("theme") === "dark" ? "dark" : "light");
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
				localStorage.setItem("theme", (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <SnackbarProvider maxSnack={3}>
                        <Box paddingTop={8} sx={{ minHeight: "100vh" }}>
                            <Banner />
                            <Outlet />
                            <Footer />
                        </Box>
                    </SnackbarProvider>
                </CssBaseline>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
