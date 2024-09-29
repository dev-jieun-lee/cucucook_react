import { Button, Card } from "@mui/material";
import styled from "styled-components";
import media from "./MediaQuery";



export const Banner = styled(({ isDarkMode, ...rest } : any) => (
  <div {...rest} />
))<{ isDarkMode: boolean }>`
  width: 100%;
  height: 100vh;
  background-image: ${({ isDarkMode }) =>
    isDarkMode
      ? "url('/image/banner_middle_dark.png')"
      : "url('/image/banner_middle_light.png')"};
  background-size: cover;
  background-position: center;
  display: flex;

`;


export const CustomBtn = styled(Button)`
  border-radius: 20px;
`;


export const BannerLeft = styled.div`
  width: 63%;
  display: flex;
  flex-direction: column;
  .card-area{
    order: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 70px 8% 0;
    margin-bottom: 10px;
    ${media.medium`
      order: 2;
      padding: 30px 8% 0;
    `};
    ${media.small`
      display: block;
    `};
  }
  .slogan-main{
    display: none;
    ${media.medium`
      display : block;
      order : 1;
  `};
  }
  ${media.medium`
    width : 100%;
    padding : 0px -20px;
  `};

`;
export const BannerRight = styled.div`
  height: 100vh;
  background-color: ${(props) => props.theme.mainColor};
  display: flex;
  flex-direction: column;  /* 요소들을 세로로 배치 */
  align-items: flex-end;   /* 요소들을 오른쪽으로 정렬 */
  width: 37%;
  padding-top: 250px;
  padding-right: 3%;

  ${media.medium`
    width : 0;
    display : none;
  `};
`;

export const MainCard = styled.div`
  width: 30%;
  height: 250px;
  border: 2px solid;
  border-radius: 15px;
  border-color: ${(props) => props.theme.mainColor};
  text-align: center;
  /* margin: 0 25px; */
  img{
    width: 100px;
    margin: 30px 0;
    ${media.small`
      width : 90px;
      margin: 10px;
  `};
  }
  
  ${media.small`
    width: 100%;
    height: 120px;
    margin-bottom : 20px;
    display : flex;
    justify-content: space-between;
    padding : 0 5%;
  `};
`;

export const BannerButton = styled(Button)`
  border-radius: 15px;
  width: 150px;
  height: 40px;
  font-size: 17px;
    
  ${media.small`
    width : 130px;
    font-size: 15px;    
    top: 50%;
    transform: translate(0, -50%)

  `};
`;



export const Slogan = styled.div`
  margin-bottom: 20px;    
  
  .box1, .box2, .box3 {
    font-family: 'ONE-Mobile-POP';
    display: flex;
    flex-direction: row;
    justify-content: flex-end; /* 각 박스 안의 텍스트를 오른쪽으로 정렬 */

  }
  .box1{
    ${media.medium`
      display : none;
    `};
  }
  .box2{
    ${media.medium`
      display : none;
    `};
  }
  .box3{
    ${media.medium`
      display : none;
    `};
  }
  .medium-box{
    display: none;
    font-family: 'ONE-Mobile-POP';
    ${media.small`
      display : block;
    `};
    
  }
  
  .strong{
    font-size: 3rem;
    font-weight: 600;
    color: ${(props) => props.theme.textColor};

    ${media.medium`
      font-size: 2.5rem;
    `};

    ${media.small`
      font-size: 1.5rem;
    `};
  }
  .basic{
    margin-left: 10px;
    margin-top: 15px;
    font-size: 2rem;
    font-weight: 600;
    color :${(props) => props.theme.subTextColor};

    ${media.medium`
      font-size: 1.5rem;
    `};
    
    ${media.small`
      font-size: 1rem;
    `};
  }

  ${media.medium`
    margin: 30px 8% 10px;    
  `};

  ${media.small`
    margin: 0px 8% ; 
  `};
`;

export const SloganButton = styled(Button)`
  width: 180px;
  height: 50px;
  font-size: 20px;
  font-weight: 600;

  ${media.medium`
    display : none;
    /* width: 150px;
    height: 40px;
    font-size: 15px;
    font-weight: 600; 
    float : right;  
    margin : 0 8%; */

  `};

  ${media.small`
    display : none;
  `};
`;

///메인의 공지사항 테이블
export const NoticeTable = styled.div`
  width: 100%;
  order: 3;

  .title {
    width: 85%;
    margin: 50px auto;
    margin-bottom: -5px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    position: relative;
    overflow: hidden; 

    .noti-icon {
      transform: scale(0.9);
      margin-right: 4px;
      margin-top: -4px;
    }

    span:hover{
      cursor: pointer;
      text-decoration: underline;
    }

  }

  .notice-table {
    width: 85%;
    margin: 20px auto;

    .table-container {
      background: none;
      box-shadow: none;

      .MuiTableCell-root {
        border-bottom: 1px solid;
        border-color: ${(props) => {
          const rgbaColor = `rgba(${parseInt(props.theme.textColor.slice(1, 3), 16)},
                                ${parseInt(props.theme.textColor.slice(3, 5), 16)},
                                ${parseInt(props.theme.textColor.slice(5, 7), 16)},
                                0.5)`; // 0.5는 50% 투명도
          return rgbaColor;
        }};
      }

      .row {
        height: 20px;
        &:hover {
          
          cursor: pointer;
          .cell{
            font-weight: bold !important;
          }
        }
      }
    }
  }
`;

export const GreetingsWrapper = styled.div`
  order: 2;
  width: 84%; 
  margin: 0 auto; 
  overflow: hidden; 
  color: ${(props) => props.theme.mainColor};
  .greetings-wrapper {
    display: flex;
    white-space: nowrap;
    animation: marquee 15s linear infinite; /* 15초 동안 무한 반복 */
  }

  .greetings {
    padding-right: 15px; /* 텍스트 간 간격 */
  }

  @keyframes marquee {
    0% {
      transform: translateX(0); /* 시작 지점 */
    }
    100% {
      transform: translateX(-100%); /* 텍스트 전체가 이동 */
    }
  }
`;