import { CircularProgress, LinearProgress } from "@mui/material";

function Loading(){
  return(
    <CircularProgress style={{margin: '15% auto'}} />
    // <LinearProgress style={{margin: '15% auto'}}/>
  )
}

export default Loading;