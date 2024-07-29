import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, CssBaseline, Paper, StyledEngineProvider, ThemeProvider, Typography } from '@mui/material';
import { darkTheme, lightTheme } from './theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleToggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    axios.get('http://localhost:8080/api/hello') // Spring Boot API URL
      .then(response => {
        setMessage(response.data); // API 응답 데이터 설정
        setError(null); // 성공 시 에러를 null로 설정
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
        setError('There was an error fetching the data.'); // 에러 메시지 설정
      });
  }, []);

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
            <Typography variant="h5">
              API 호출 결과: {message}
            </Typography>
            {error && <Typography variant="h6" color="error">{error}</Typography>}
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
