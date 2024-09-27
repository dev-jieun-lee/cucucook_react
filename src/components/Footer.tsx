import { MenuItem, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useEffect } from "react";

function Footer({ isDarkMode }: any) {
  const { t, i18n } = useTranslation(); 

  const handleLangChange = (event: any) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
    sessionStorage.setItem('selectedLang', selectedLang); 
  };

  useEffect(() => {
    const savedLang = sessionStorage.getItem('selectedLang');
    if (savedLang) {
      i18n.changeLanguage(savedLang); // 저장된 언어로 설정
    }
  }, [i18n]);

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
            value={i18n.language} // 현재 언어 상태
            onChange={handleLangChange} // 언어 변경 핸들러
          >
            <MenuItem value="ko">{t("language.ko")}</MenuItem>
            <MenuItem value="en">{t("language.en")}</MenuItem>
          </Select>
        </div>
      </div>
      <div className="bottom">
        <p>{t("Footer.ceo")}</p>
        <p>{t("Footer.account")}</p>
        <p>02-1234-5678</p>
        <small>© copyright 2024 jiunerim</small>
      </div>
    </FooterWrapper>
  );
}

export default Footer;

const FooterWrapper = styled.div`
  margin: -120px 0;
  background-color: ${(props) => props.theme.footerColor};
  padding: 50px 60px;
  .top {
    display: flex;
    justify-content: space-between;
  }
  img {
    width: 100px;
  }
  .bottom {
    color: ${(props) => props.theme.mainColor};
    opacity: 9;
    p {
      font-size: 13px;
    }
  }
`;
