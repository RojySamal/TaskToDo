import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppAppBar from "../components/AppAppBar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function HomePage() {
  const [mode, setMode] = React.useState("light");
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <Features />
        <Divider />
        <FAQ />
        <Divider
          sx={{
            height: 4,
            backgroundColor: "black",
            margin: "15px",
          }}
        />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
