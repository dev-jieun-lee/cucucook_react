import { Button, ListItem } from "@mui/material";
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
  ${media.small`
    height: 110vh;
  `};
  ${media.xsmall`
    height: 142vh;
  `};
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
  position : relative;
  ${media.small`
    margin-top : -50px;
  `}
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
  }
`;

export const GreetingsWrapper = styled.div`
  order: 2;
  width: 84%; 
  margin: 0 auto; 
  overflow: hidden; 
  color: ${(props) => props.theme.mainColor};
  position: relative;
  .greetings-wrapper {
    display: flex;
    white-space: nowrap;
    max-width: 100%;
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
  ${media.small`
    margin-bottom: 30px; /* 추가: 공지사항 테이블과 푸터 간 간격 확보 */
    .greetings-wrapper {
      max-width: 100%; /* 추가: 작은 화면에서도 잘 보이게 */
    }
  `}
`;

export const MainNoticeTable = styled.div`
  width: 100%;
  .header{
    border-bottom: 1px solid;
    border-top: 1px solid;
    height: 55px;
    border-color: ${(props) =>  props.theme.navBorderColor};
    font-size: 14px;
    text-align: center;

    .item-category{
      flex: 3;
      ${media.small`
        display : none;
      `};
    }
    .item-title{
      flex: 10;
      ${media.small`
        flex: 13;
      `};
    }
    .item-date{
      flex: 3;
      ${media.small`
        flex: 5;
      `};
    }
  }
  .list-item{
    font-size : 15px;
    border-bottom: 1px solid;
    height: 50px;
    border-color: ${(props) =>  props.theme.navBorderColor};
    ${media.small`
      height: 55px;
    `};
    .item-category-row{
      flex: 3;
      text-align: center;
      ${media.small`
        margin-bottom : 2px;
        font-size : 12px;
      `}; 

    }
    .item-title-row{
      margin-left: 20px;
      flex: 10;
      width: 95%;
      align-items: flex-start;
      white-space: nowrap;         
      overflow: hidden;            
      text-overflow: ellipsis;  
      ${media.small`
        margin-left: 0px;
      `}; 
    }
    .item-date-row{
      flex: 3;
      ${media.medium`
        font-size: 14px;
        color : ${(props : any) =>  props.theme.navBorderColor};
      `};
      ${media.small`
        flex: 5;
        font-size: 12px;
        color : ${(props : any) =>  props.theme.navBorderColor};
      `};
    }
    .contents{
      width: 95%;
      flex: 13;
      display: flex;
      text-align : left;
      align-items: flex-start;
      white-space: nowrap;         
      overflow: hidden;            
      text-overflow: ellipsis;   
      ${media.small`
        flex: 11;
        /* flex: 4; */
        /* margin-left : 20px; */
        flex-direction: column;
        text-align : left;
        align-items: flex-start;
      `};
    }
    &:hover{
      cursor: pointer;
      font-weight : bold;
    }
  }
`;