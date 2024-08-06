import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, CssBaseline, Paper, StyledEngineProvider,  Typography } from '@mui/material';
import { muiDarkTheme, muiLightTheme, styledDarkTheme, styledLightTheme } from './theme';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// material-ui
import {ThemeProvider as MuiThemeProvider} from "@mui/material";
// styled-components
import {ThemeProvider as StyledThemeProvider} from "styled-components"
import TestPage from './TestPage';
import Main from './routes/main/Main';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
      <StyledThemeProvider theme={isDarkMode ? styledDarkTheme : styledLightTheme}>
        <StyledEngineProvider injectFirst>
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100vh',
            width: '70%',
            margin: '0 auto'
          }}
        >
          <BrowserRouter>
            <Header isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
            <Routes>
              <Route path="/main" element={< Main/>}></Route>
              <Route path="/test" element={<TestPage />}></Route>
              <Route path="/myPage" element={<MyPage />}></Route>
              </Routes>
            {/* <Footer /> */}
          </BrowserRouter>
        </Box>
        </StyledEngineProvider>
      </StyledThemeProvider>

  </MuiThemeProvider>
  );
}

export default App;