import styled, { Styled } from "styled-components";
import media from "./MediaQuery";
import { Fab } from "@mui/material";

export const Wrapper = styled.div`
  width: calc(100% - 220px);
  margin: 0 auto;
  padding: 0 2%;
  align-items: center;
  text-align: center;

  ${media.medium`
    width: 100%;
  `};
`;

export const TitleCenter = styled.div`
  margin: 0px auto;
  margin-bottom: 30px;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};
`;

export const TitleBasic = styled.div`
  margin: 20px auto;
  font-size: 25px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};
`;

export const PageTitleBasic = styled.div`
  font-weight: 500;
  font-size: 25px;
  text-align: left;
`;

export const PageSubTitleBasic = styled.div`
  font-weight: 600;
  font-size: 18px;
  text-align: left;
`;

//맨위로 가기 스크롤 버튼
export const ScrollBtnFab = styled(Fab)`
  position: fixed;
  bottom: 16px;
  right: 16px;

  ${media.medium`
    bottom: 8px,
    right: 8px,
    width: 40px,
    height: 40px,
  `};
`;
