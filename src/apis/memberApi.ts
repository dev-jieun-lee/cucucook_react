import axios from "axios";
import Cookies from "js-cookie"; // js-cookie 라이브러리 추가
import { useMutation } from "react-query";

const apiUrl = process.env.REACT_APP_API_URL;
const BASE_URL = apiUrl + "/api/members";
const TOKEN_EXPIRED_DAY: number = Number(process.env.TOKEN_EXPIRED_DAY);
// REST API 키 설정
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.KAKAO_REDIRECT_URL;


// 기본 axios 인스턴스 설정
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 에러 처리 헬퍼 함수
function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    // Axios 에러
    throw new Error(error.response?.data?.message || "API 요청 실패");
  } else if (error instanceof Error) {
    // 일반 에러
    throw new Error(error.message);
  } else {
    // 기타 에러
    throw new Error("알 수 없는 에러 발생");
  }
}

// 로그인 요청
export async function login(form: { userId: string; password: string }) {
  try {
    const response = await api.post("/login", form);
    console.log("로그인 응답데이터", response.data);

    if (response.data.token) {
      Cookies.set("auth_token", response.data.token, {
        expires: TOKEN_EXPIRED_DAY,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      });
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      // 서버에서 전달된 전체 응답 데이터 출력
      console.log("서버 응답 데이터:", error.response.data);

      // 실패 횟수와 잠금 시간을 출력
      console.log("실패 횟수:", error.response.data.failedAttempts || 0);
      console.log("잠금 시간:", error.response.data.lockoutTime || "없음");
    } else {
      console.error("알 수 없는 오류 발생:", error);
    }

    handleApiError(error);
  }
}

// 로그아웃 요청
export async function logout() {
  try {
    const response = await api.post("/logout");
    console.log("로그아웃 응답데이터", response.data);

    // 로그아웃 시 쿠키에서 JWT 토큰 삭제
    Cookies.remove("auth_token");

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

// 핸드폰번호 중복체크
export async function phoneCheck(form: any) {
  const response = await axios.post(`${BASE_URL}/check-phone`, form);
  console.log("핸드폰번호 중복체크 응답데이터", response.data);
  return response.data;
}

// 아이디 중복체크
export async function idCheck(id: string) {
  const response = await axios.get(`${BASE_URL}/check-id/${id}`);
  console.log(
    "아이디중복체크 응답데이터( true -사용가능, false - 사용불가",
    response.data
  );
  return response.data;
}

// 회원가입
export async function register(form: any) {
  const response = await axios.post(`${BASE_URL}/register`, form);
  console.log("회원가입 응답데이터", response.data);
  return response.data;
}

// 아이디찾기
export const findId = async (data: {
  name: string;
  email: string;
  verificationCode: string;
}) => {
  console.log("아이디찾기data:", data);
  const response = await fetch("/api/members/find-id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("아이디 찾기 오류");
  }

  return response.json();
};

// 이메일 인증 코드 발송
export const useSendEmailVerificationCode = () =>
  useMutation((email: string) =>
    api
      .post("/sendVerificationCode", { email })
      .then((response) => {
        console.log("이메일 인증 코드 발송 성공:", response.data);
        return response.data;
      })
      .catch(handleApiError)
  );

// 이메일 인증 코드 검증
export const useVerifyEmailCode = () =>
  useMutation(({ email, code }: { email: string; code: string }) =>
    api
      .post("/verify", { email, code })
      .then((response) => {
        console.log("이메일 인증 코드 검증 성공:", response.data);
        return response.data;
      })
      .catch(handleApiError)
  );

// 이메일 중복 체크 API
export function useCheckEmailExists() {
  return useMutation(async (email: string) => {
    const response = await axios.get(`/api/members/check-email/${email}`);
    return response.data; // 서버가 true 또는 false를 반환한다고 가정
  });
}

// 비밀번호찾기
export const fetchPassword = async (data: {
  name: string;
  email: string;
  userId: string;
  verificationCode: string;
}) => {
  const response = await api.post("/find-pw", data);

  if (response.status !== 200) {
    throw new Error("비밀번호 찾기 오류");
  }

  return response.data;
};

// 비밀번호 찾기 훅
export const useFetchPassword = () => useMutation(fetchPassword);

// JWT 토큰 검증 요청
export async function validateToken(token: string) {
  try {
    const response = await api.post("/validateToken", { token });
    return response.data; // { valid: boolean } 형태의 데이터 반환
  } catch (error) {
    handleApiError(error);
  }
}

// 이메일, 이름, ID로 사용자 존재 여부 확인 API
export async function checkUserInfoExists(
  name: string,
  email: string,
  id: string
) {
  const response = await axios.post(`${BASE_URL}/check-user-info`, {
    name,
    email,
    id,
  });
  console.log(
    "이름, 이메일, 아이디로 존재 여부 확인 응답데이터",
    response.data
  );
  return response.data; // 서버가 { exists: true/false } 형태로 반환한다고 가정
}
// 사용자 정보 확인 훅
export const useCheckUserInfoExists = () =>
  useMutation(
    ({ name, email, id }: { name: string; email: string; id: string }) =>
      checkUserInfoExists(name, email, id)
  );

// 회원 정보를 가져오는 API 호출 함수
export async function getMember(memberId: string) {
  console.log(`회원 정보 조회 요청: memberId=${memberId}`); // 요청 로그
  try {
    const response = await axios.get(`${BASE_URL}/getMember`, {
      params: { memberId },
    });

    console.log("서버 응답 상태 코드:", response.status); // 응답 상태 코드 로그
    console.log("서버 응답 헤더:", response.headers); // 응답 헤더 로그
    console.log("회원 정보 조회 성공:", response.data); // 응답 성공 로그

    return response.data; // 전체 회원 정보를 반환
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios 에러 객체일 경우
      console.error("Axios 에러 발생:", error.response?.data);
      console.error("응답 상태 코드:", error.response?.status); // 응답 상태 코드 로그
    } else {
      // 기타 에러
      console.error("회원 정보 조회 중 에러 발생:", error);
    }
    throw error; // 에러 발생 시 throw
  }
}

// 회원 탈퇴 API 호출 함수
export const deleteAccount = async (memberId: string) => {
  try {
    console.log(`회원 탈퇴 시도: memberId=${memberId}`);
    const response = await axios.delete(
      `${BASE_URL}/deleteAccount/${memberId}`
    );
    console.log("회원 탈퇴 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("회원 탈퇴 실패:", error);
    throw error;
  }
};

//회원 목록 조회
export async function getMemberList(params: any) {
  const response = await axios.get(`${BASE_URL}/getMemberList`, {
    params: params,
  });
  return response.data;
}

// 카카오 토큰 요청
export const kakaoLogin = async (code: string) => {
  try {
    const response = await axios.post(
      `https://kauth.kakao.com/oauth/token`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          grant_type: "authorization_code",
          client_id: KAKAO_CLIENT_ID,
          redirect_uri: REDIRECT_URI,
          code: code,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Kakao login failed", error);
    throw error;
  }
};
