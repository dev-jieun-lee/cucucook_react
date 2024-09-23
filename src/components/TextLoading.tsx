
import CircularProgress from '@mui/material/CircularProgress';
import styled, { keyframes } from 'styled-components';

const CenteredWrapper = styled.div`
  margin: 15% auto;
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; */
`;

const loadingAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const LoadingText = styled.div`
  /* margin-top: 20px; */
  margin: 15% auto;
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(90deg, #cccccc 25%, #999999 50%, #cccccc 75%);
  background-size: 200px 100%;
  animation: ${loadingAnimation} 1.5s infinite;
  color: transparent; /* 텍스트를 숨기고 스켈레톤 효과만 표시 */
  background-clip: text;
  -webkit-background-clip: text;
`;

function TextLoading() {
  return (
    <CenteredWrapper>
      {/* <CircularProgress /> */}
      <LoadingText>Loding...</LoadingText>
    </CenteredWrapper>
  );
}

export default TextLoading;

