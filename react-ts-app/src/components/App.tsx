import { Outlet } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";

import Banner from "./Banner";
import Footer from "./Footer";

import theme from "./MUITheme";

function App() {
  

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Box paddingTop={8} sx={{ minHeight: "100vh"}}>
          <Banner />
          <Outlet />
          <Footer />
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
