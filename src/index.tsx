import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { createGlobalStyle } from "styled-components";
import "./locales/i18n";

const GlobalStyle = createGlobalStyle`
  //둥근느낌
  @font-face {
    font-family: 'ONE-Mobile-POP';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-POP.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  //도트느낌
  @font-face {
    font-family: 'DungGeunMo';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }
  body {
    font-family: 'Pretendard-Regular' !important;
  }
  .swal2-container {
    z-index: 10000 !important;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const client = new QueryClient();
root.render(
  //<React.StrictMode>
  <QueryClientProvider client={client}>
    <GlobalStyle />
    <App />
  </QueryClientProvider>
  // </React.StrictMode>
);
