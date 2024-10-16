import { Box, CircularProgress } from "@mui/material";

function LoadingNoMargin() {
  return (
    <Box sx={{margin : "10px auto", width : "100%", textAlign : "center"}}>
      <CircularProgress />
    </Box>
  )
}

export default LoadingNoMargin;
