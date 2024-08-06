import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import axios from 'axios';//엑시오스설정
import { Box, Button, Container, CssBaseline, Paper, StyledEngineProvider, ThemeProvider, Typography } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
=======
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
import MyPage from './routes/myPage/MyPage'; 
>>>>>>> 316da2797aed06479354d4b2293974bcff37991f

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
<<<<<<< HEAD
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <StyledEngineProvider injectFirst>
=======
    <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
      <StyledThemeProvider theme={isDarkMode ? styledDarkTheme : styledLightTheme}>
        <StyledEngineProvider injectFirst>
>>>>>>> 316da2797aed06479354d4b2293974bcff37991f
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100vh',
<<<<<<< HEAD
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
=======
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
>>>>>>> 316da2797aed06479354d4b2293974bcff37991f
  );
}

export default App;
