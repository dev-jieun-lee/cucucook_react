import { Box, Button, Container, CssBaseline, Paper, StyledEngineProvider, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import { darkTheme, lightTheme } from "./theme";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <StyledEngineProvider injectFirst>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container>
          <Button variant="contained" color="primary" onClick={handleToggleTheme}>
            Toggle Theme
          </Button>
          <Typography variant="h1">Hello</Typography>
          <Typography variant="h2">Hello</Typography>
          <Typography variant="h3">Hello</Typography>
          <Typography variant="h4">Hello</Typography>
          <p>This is an example of {isDarkMode ? 'Dark' : 'Light'} Mode</p>
          <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            This is a Paper component
          </Paper>
        </Container>
      </Box>
      </StyledEngineProvider>
    </ThemeProvider>
  );
}

export default App;
