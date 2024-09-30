import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoLogin } from "../../../apis/memberApi";

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 인가 코드를 추출
    const urlParams = new URL(window.location.href).searchParams;
    const code = urlParams.get("code");

    if (code) {
      // 카카오 로그인 API 호출
      kakaoLogin(code)
        .then((data) => {
          // 받은 accessToken 및 JWT 토큰 저장
          localStorage.setItem("accessToken", data.access_token);

          // 로그인 성공 시 메인 페이지로 이동
          navigate("/");
        })
        .catch((error) => {
          console.error("Kakao login failed:", error);
          alert("카카오 로그인에 실패했습니다. 다시 시도해 주세요.");
        });
    }
  }, [navigate]);

  return <div>카카오 로그인 중...</div>;
};

export default KakaoRedirectHandler;
