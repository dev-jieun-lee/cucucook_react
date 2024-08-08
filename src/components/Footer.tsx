import { MenuItem, Select } from "@mui/material";
import styled from "styled-components";

function Footer({ isDarkMode }: any) {
  return (
    <FooterWrapper>
      <div className="top">
        <div>
          {isDarkMode ? (
            <img src="/logo/dark_text_logo.png" alt="text logo" />
          ) : (
            <img src="/logo/light_text_logo.png" alt="text logo" />
          )}
        </div>
        <div>
          <Select
            labelId="language-select-label"
            value={"Ko"}
            label="언어"
            // onChange={handleChange}
          >
            <MenuItem value="Ko">한국어</MenuItem>
            <MenuItem value="Eng">영어</MenuItem>
          </Select>
        </div>
      </div>
      <div className="bottom">
        <p>대표 : 지으네림</p>
        <p>사랑시 고백구 행복동 12345 (주)쿠쿠쿡</p>
        <p>02-1234-5678</p>
        <small>© copyright 2024 jiunerim</small>
      </div>
    </FooterWrapper>
  );
}

export default Footer;

const FooterWrapper = styled.div`
  margin: 50px 0;

  .top{
    display: flex;
    justify-content: space-between;
  }
  img{
    width: 100px;
  }
  .bottom{
    color: ${(props) => props.theme.mainColor};
    opacity: 9;
    p{
      font-size: 13px;
    }
  }
`;
