import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleNaverCallback } from "../../../apis/socialLoginApi";
import { useAuth } from "../../../auth/AuthContext";

const NaverCallback = () => {
  const navigate = useNavigate();
  const { setUser, setLoggedIn } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      const userData = async () => {
        try {
          const data = await handleNaverCallback(code);
          // 이후 사용자 정보를 처리 (예: 로그인 상태 업데이트)
          setUser({
            userId: data.member.userId,
            name: data.member.name,
            role: data.member.role,
            memberId: data.member.memberId,
          });

          setLoggedIn(true);
          // 로그인 성공 후 리다이렉트
          navigate("/"); // 원하는 페이지로 리다이렉트
        } catch (error) {
          console.error("로그인 처리 중 오류 발생:", error);
          // 오류 처리 로직 추가 (예: 오류 메시지 표시)
        }
      };
      userData(); // 비동기 함수 호출
    }
  }, [navigate]);

  return (
    <div>
      <h2>네이버 로그인 처리 중...</h2>
    </div>
  );
};

export default NaverCallback;
