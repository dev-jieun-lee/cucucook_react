import axios from "axios";

// 환경 변수에서 KAKAO와 NAVER의 CLIENT_ID와 REDIRECT_URI 가져오기
const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;

if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
  console.error("카카오 환경 변수가 제대로 설정되지 않았습니다.");
}

if (!NAVER_CLIENT_ID || !NAVER_REDIRECT_URI) {
  console.error("네이버 환경 변수가 제대로 설정되지 않았습니다.");
}

// 카카오, 네이버 인가 요청 URL 생성
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
export const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=STATE`;

// 각 소셜 로그인 핸들러 (로그인 버튼에서 호출)
export const kakaoLoginHandler = () => {
  window.location.href = KAKAO_AUTH_URL; // 카카오 로그인 URL로 이동
};

export const naverLoginHandler = () => {
  window.location.href = NAVER_AUTH_URL; // 네이버 로그인 URL로 이동
};

// 인가 코드를 백엔드로 전달하는 함수
const KAKAO_BACKEND_URL = "http://localhost:8080/auth/kakao/login"; // 백엔드 URL
const NAVER_BACKEND_URL = "http://localhost:8080/auth/naver/login"; // 백엔드 URL

let isKakaoCallbackProcessing = false;

//카카오백엔드
export const handleKakaoCallback = async (code: string) => {
  // 중복 요청 방지
  if (isKakaoCallbackProcessing) {
    console.warn("이미 카카오 콜백 요청이 처리 중입니다.");
    return;
  }

  isKakaoCallbackProcessing = true; // 중복 요청 방지 플래그 설정
  console.log("인가 코드 수신:", code);
  try {
    // URL 파라미터를 사용하여 인증 코드 전달
    const params = new URLSearchParams({ code }).toString();
    const response = await axios.post(
      `${KAKAO_BACKEND_URL}?${params}`,
      null, // POST 바디는 필요 없으므로 null 처리
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    isKakaoCallbackProcessing = false; // 처리 완료 후 플래그 해제
    return response.data;
  } catch (error) {
    isKakaoCallbackProcessing = false; // 처리 실패 시 플래그 해제
    console.error("카카오 로그인 처리 중 오류 발생", error);
    throw error;
  }
};

export const handleNaverCallback = async (code: string) => {
  console.log("네이버 인가코드:", code);
  try {
    const response = await axios.post(`${NAVER_BACKEND_URL}`, { code });
    return response.data;
  } catch (error) {
    console.error("네이버 로그인 처리 중 오류 발생", error);
    throw error;
  }
};
