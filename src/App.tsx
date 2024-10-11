import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { Box, CssBaseline, StyledEngineProvider } from "@mui/material";
// material-ui
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
// styled-components
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "./auth/AuthContext";
import {
  muiDarkTheme,
  muiLightTheme,
  styledDarkTheme,
  styledLightTheme,
} from "./theme";
import i18n from "./locales/i18n";
import RoutesConfig from "./RoutesConfig";
import Loading from "./components/Loading";
import AutoScrollTop from "./components/AutoScrollTop";

const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const handleToggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
          <StyledThemeProvider
            theme={isDarkMode ? styledDarkTheme : styledLightTheme}
          >
            <StyledEngineProvider injectFirst>
              <CssBaseline />
              <BrowserRouter>
              <AutoScrollTop/>
                <Suspense fallback={<Loading />}>
                  <Box sx={{ width: "100%" }}>
                    <Header
                      isDarkMode={isDarkMode}
                      onToggleTheme={handleToggleTheme}
                    />
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "background.default",
                      minHeight: "100vh",
                      width: "100%",
                      margin: "120px auto",
                    }}
                  >
                    <RoutesConfig isDarkMode={isDarkMode} />
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    <Footer isDarkMode={isDarkMode} />
                  </Box>
                </Suspense>
              </BrowserRouter>
            </StyledEngineProvider>
          </StyledThemeProvider>
        </MuiThemeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
