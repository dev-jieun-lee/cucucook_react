import { Button, Card } from "@mui/material";
import styled from "styled-components";

export const MainWrapper = styled.div`
`;

export const Banner = styled(({ isDarkMode, ...rest } : any) => (
  <div {...rest} />
))<{ isDarkMode: boolean }>`
  .main-banner {
    width: 100%;
    height: 600px;
  }
  width: 100%;
  height: 850px;
  background-image: ${({ isDarkMode }) =>
    isDarkMode
      ? "url('/image/banner_img_dark.png')"
      : "url('/image/banner_img_light.png')"};
  background-size: cover;
  display: flex;
`;

export const CustomBtn = styled(Button)`
  border-radius: 20px;
`;


export const BannerLeft = styled.div`
  width: 100%;
  .card-area{
    display: flex;
    padding: 250px 50px 0;
  }
`;
export const BannerRight = styled.div`
  display: flex;
  flex-direction: column;  /* 요소들을 세로로 배치 */
  align-items: flex-end;   /* 요소들을 오른쪽으로 정렬 */
  width: 100%;
  padding-top: 250px;
  padding-right: 100px;
  .icon-btn{
    width: 180px;
    height: 50px;
    font-size: 20px;
    font-weight: 600;
  }
`;

export const MainCard = styled.div`
  width: 250px;
  height: 250px;
  border: 2px solid;
  border-radius: 15px;
  border-color: ${(props) => props.theme.mainColor};
  text-align: center;
  margin: 0 25px;
  img{
    width: 100px;
    margin: 30px 0;
  }
`;

export const BannerButton = styled(Button)`
  border-radius: 15px;
  width: 150px;
  height: 40px;
  font-size: 17px;
`;


export const Slogan1 = styled.div`
  margin: 10px 80px;
  color: ${(props) => props.theme.mainColor};
`;

export const Slogan2 = styled.div`
  display: flex;
  flex-direction: column; /* 각 문구를 세로로 배치 */
  align-items: flex-end;  /* 문구들을 오른쪽으로 정렬 */
  margin-bottom: 20px;    
  
  .box1, .box2, .box3 {
    font-family: 'ONE-Mobile-POP';
    display: flex;
    flex-direction: row;
    justify-content: flex-end; /* 각 박스 안의 텍스트를 오른쪽으로 정렬 */
  }
  
  .strong{
    font-size: 50px;
    font-weight: 600;
    color: ${(props) => props.theme.textColor};
  }
  .basic{
    margin-left: 10px;
    margin-top: 15px;
    font-size: 30px;
    font-weight: 600;
    color :${(props) => props.theme.subTextColor};
  }
`;

export const RecipeWrapper = styled.div``;