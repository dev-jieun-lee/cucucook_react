import styled from "styled-components";
import media from "./MediaQuery";
import { Fab, Stack } from "@mui/material";

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
  ${media.xsmall`
    font-size: 27px;
  `};
`;

export const TitleBasic = styled.div`
  margin: 20px auto;
  font-size: 25px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};
`;

export const TitleBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const PageTitleBasic = styled.div`
  text-align: left;
  font-size: 25px;
  font-weight: 600;
  color: ${(props) => props.theme.mainColor};
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

//검색 스타일
export const SearchArea = styled.div`
  /* margin: 30px ; */
  margin-top: 40px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  ${media.small`
    display: block;
    /* margin-left : 50px; */
  `};
  ${media.xsmall`
    /* margin-left : 25px;
    margin-right : 25px; */
  `};

  .select-category {
    width: 150px;
    margin-right: 50px;
    ${media.small`
    margin : 0 auto;
    margin-bottom : 10px;
    margin-right : 20px;
    /* margin-left : 50px; */
  `};
  }

  .select-category-item {
    width: 200px;
    /* margin-right: 50px; */
  }
  .search-input {
    width: 350px;
  }
`;

//페이지네이션 스타일
export const CustomPagination = styled(Stack)`
  margin: 15px;
  .pagination-btn {
    margin: 0 auto;
  }
`;

//dialog 스타일
export const DialogTitleArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    color: ${(props) => props.theme.mainColor};
    font-weight: 600;
  }
  .close-btn {
    height: 40px;
    margin: 15px;
  }
`;

export const DialogForm = styled.form`
  position: relative;
  .input-form {
    display: block;
    margin-bottom: 20px;
    &:first-child {
      margin-top: 15px;
    }
  }
`;
