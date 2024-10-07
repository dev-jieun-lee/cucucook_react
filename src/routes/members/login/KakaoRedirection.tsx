import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleKakaoCallback } from "../../../apis/socialLoginApi"; // 카카오 콜백 함수 임포트

const KakaoCallback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (code && !isProcessing) {
      setIsProcessing(true); // 요청 중 상태 설정
      handleKakaoCallback(code)
        .then((data) => {
          console.log("카카오 로그인 성공:", data);
          navigate("/"); // 로그인 성공 시 메인 페이지로 이동
        })
        .catch((error) => {
          console.error("카카오 로그인 처리 중 오류:", error);
          navigate("/login"); // 로그인 실패 시 로그인 페이지로 이동
        })
        .finally(() => setIsProcessing(false)); // 완료 후 상태 초기화
    }
  }, [location.search, isProcessing, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
