import styled from "styled-components";
import media from "./MediaQuery";
import { Stack } from "@mui/material";

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

  .add-btn {
    margin-top: -4px;
    margin-left: 15px;
    transform: scale(0.9);
    z-index: 1;
    box-shadow: none;
  }

  .form {
    width: 100%;
  }

  /* scrollBar CSS */
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.scrollbarBackColor};
  }
  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.scrollbarColor};
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.scrollboarHoverColor};
  }
`;

export const TitleCenter = styled.div`
  margin: -15px auto;
  /* margin-bottom: 30px; */
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

export const SearchArea = styled.div`
  /* margin: 30px ; */
  margin-top: 40px;
  margin-bottom: 25px;
  display: flex;
  ${media.small`
    display: block;
  `};
  .select-category {
    width: 130px;
    margin-right: 50px;
    ${media.small`
    margin : 0 auto;
    margin-bottom : 10px;
  `};
  }
  .select-category-item {
    width: 180px;
    margin-right: 50px;
  }
  .search-input {
    width: 350px;
  }
`;

export const CustomPagination = styled(Stack)`
  margin: 15px;
  .pagination-btn {
    margin: 0 auto;
  }
`;
