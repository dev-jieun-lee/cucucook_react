import styled from "styled-components";
import media from "./MediaQuery";

export const Wrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  /* padding: 0 2%; */
  align-items: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh; 

  ${media.medium`
    width: 100%;
  `};

  .add-btn{
    margin-top: -4px;
    margin-left: 15px;
    transform: scale(0.9);
    z-index : 1;
    box-shadow: none;
  }

  .form{
    width: 100%;
  }
`;

export const TitleCenter = styled.div`
  margin: -15px auto;
  /* margin-bottom: 30px; */
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};;
`;

export const TitleBasic = styled.div`
  margin: 20px auto;
  font-size: 25px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};;
`;

