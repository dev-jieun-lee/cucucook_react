import { createTheme, PaletteMode } from "@mui/material";
import { DefaultTheme } from "styled-components";

///테마 지정 색깔
//라이트모드
//밥로고 #F3B340
//글씨 #364C63
//배뎡 #F4F3EF

//다크모드
//밥로고 #F2EFDB
//글씨 #FDA47E
//배경 #3D3737

//*****************************styled-components */
export const styledLightTheme: DefaultTheme = {
  bgColor: "#F4F3EF",
  textColor: "#364C63",
  mainColor: "#F3B340",
  contrastColor: "#fff",
  footerColor: "#f3f0e2",
  navBorderColor: "#ccc",
  tableBorderColor: "#cccccc7f",
  tableHoverColor: "#e7e7e645",
  searchBorderColor: "#ccc",

  scrollbarBackColor: "#d5d2d25d",
  scrollbarColor: "#88888878",
  scrollboarHoverColor: "#55555575",

  subTextColor: "#253342",
  subTextColorGray: "#ccc",

  accordionColor: "#f3f0e27c",
};
export const styledDarkTheme: DefaultTheme = {
  bgColor: "#3D3737",
  textColor: "#FDA47E",
  mainColor: "#F2EFDB",
  contrastColor: "#000",
  footerColor: "#363131",
  navBorderColor: "#878585c1",
  tableBorderColor: "#7a797950",
  tableHoverColor: "#4b464646",
  searchBorderColor: "#878585c1",

  scrollbarBackColor: "#76757539",
  scrollbarColor: "#88888878",
  scrollboarHoverColor: "#74747478",

  subTextColor: "#d28c6f",
  subTextColorGray: "#878585c1",

  accordionColor: "#3631316a",
};

//*****************************mui */
//라이트모드
export const muiLightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F3B340",
      contrastText: "#fff",
    },
    secondary: {
      main: "#364C63",
    },
    info: {
      main: "#d28c6f",
    },
    background: {
      default: "#F4F3EF", // 라이트 모드 배경 색상
      paper: "#f5f5f5", // 카드, 모달 등 배경 색상
    },
  },
  typography: {
    fontFamily: "Pretendard-Regular, Arial, sans-serif", // 기본 폰트 설정
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: "#364C63", // 고정 색상
        },
        h2: {
          color: "#364C63", // 고정 색상
        },
        h3: {
          color: "#364C63", // 고정 색상
        },
        h4: {
          color: "#364C63", // 고정 색상
        },
      },
    },
  },
});

//다크모드
export const muiDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F2EFDB",
      contrastText: "#000",
    },
    secondary: {
      main: "#FDA47E",
    },
    info: {
      main: "#d28c6f",
    },
    background: {
      default: "#3D3737", // 다크 모드 배경 색상
      paper: "#424242",
    },
  },
  typography: {
    fontFamily: "Pretendard-Regular, Arial, sans-serif", // 기본 폰트 설정
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: "#FDA47E", // 고정 색상
        },
        h2: {
          color: "#FDA47E", // 고정 색상
        },
        h3: {
          color: "#FDA47E", // 고정 색상
        },
        h4: {
          color: "#FDA47E", // 고정 색상
        },
      },
    },
  },
});
