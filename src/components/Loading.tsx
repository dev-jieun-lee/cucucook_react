import { Box, LinearProgress } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import styled from 'styled-components';

const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;  
`;

function Loading() {
  return (
    // <CenteredWrapper>
    //   <CircularProgress />
    // </CenteredWrapper>
    <Box sx={{ width: '100%', marginTop : '0px' }}>
      <LinearProgress />
    </Box>
  );
}

export default Loading;
