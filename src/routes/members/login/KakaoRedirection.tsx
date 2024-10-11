import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleKakaoCallback } from "../../../apis/socialLoginApi";
import { useAuth } from "../../../auth/AuthContext";

const KakaoCallback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, setLoggedIn } = useAuth();

  // `code`를 useEffect 외부에서 정의
  const code = new URLSearchParams(location.search).get("code");

  useEffect(() => {
    if (code && !isProcessing) {
      setIsProcessing(true);
      handleKakaoCallback(code)
        .then((data) => {
          console.log("카카오 로그인 성공:", data);
          setUser({
            userId: data.member.userId,
            name: data.member.name,
            role: data.member.role,
            memberId: data.member.memberId,
          });

          setLoggedIn(true);

          navigate("/"); // 로그인 성공 시 메인 페이지로 이동
        })
        .catch((error) => {
          console.error("카카오 로그인 처리 중 오류:", error);
          navigate("/login"); // 로그인 실패 시 로그인 페이지로 이동
        })
        .finally(() => setIsProcessing(false));
    }
  }, [code, isProcessing, navigate]); // `code`를 의존성 배열에 포함

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
