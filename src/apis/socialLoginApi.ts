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
const KAKAO_BACKEND_URL = process.env.REACT_APP_KAKAO_BACKEND_URL;
const NAVER_BACKEND_URL = process.env.REACT_APP_NAVER_BACKEND_URL;
let isKakaoCallbackProcessing = false;

// 중복 요청 방지를 위한 플래그를 전역 변수로 설정하지 말고, 로컬 스테이트나 다른 메커니즘을 사용
export const handleKakaoCallback = async (code: string) => {
  try {
    const params = new URLSearchParams({ code }).toString();
    const response = await axios.post(`${KAKAO_BACKEND_URL}?${params}`, null, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  } catch (error) {
    console.error("카카오 로그인 처리 중 오류 발생", error);
    throw error;
  }
};

export const handleNaverCallback = async (code: string) => {
  try {
    // 쿼리 파라미터로 코드를 전달합니다.
    const params = new URLSearchParams({ code });
    const response = await axios.post(
      `${NAVER_BACKEND_URL}?${params.toString()}`
    );

    return response.data; // 사용자 정보 반환
  } catch (error) {
    console.error("네이버 로그인 처리 중 오류 발생", error);
    throw error; // 에러 발생 시 재던져서 처리할 수 있도록 함
  }
};
