import axios from "axios";
import Cookies from "js-cookie"; // js-cookie 라이브러리 추가
import { useMutation } from "react-query";

const apiUrl = process.env.REACT_APP_API_URL;
const BASE_URL = apiUrl + "/api/members";

// 기본 axios 인스턴스 설정
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그인 요청
export async function login(form: {
  userId: string;
  password: string;
  rememberLogin: boolean;
}) {
  try {
    const response = await api.post("/login", form);

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
    } else {
      console.error("알 수 없는 오류 발생:", error);
    }
  }
}

// 로그아웃 요청
export async function logout() {
  try {
    const response = await api.post("/logout");

    return response.data;
  } catch (error) {}
}

// 핸드폰번호 중복체크
export async function phoneCheck(form: any) {
  const response = await axios.post(`${BASE_URL}/check-phone`, form);
  return response.data;
}

// 아이디 중복체크
export async function idCheck(id: string) {
  const response = await axios.get(`${BASE_URL}/check-id/${id}`);
  return response.data;
}

// 회원가입
export async function register(form: any) {
  const response = await axios.post(`${BASE_URL}/register`, form);
  return response.data;
}

// 아이디찾기
export const findId = async (data: {
  name: string;
  email: string;
  verificationCode: string;
}) => {
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
    api.post("/sendVerificationCode", { email }).then((response) => {
      return response.data;
    })
  );

// 이메일 인증 코드 검증
export const useVerifyEmailCode = () =>
  useMutation(({ email, code }: { email: string; code: string }) =>
    api.post("/verify", { email, code }).then((response) => {
      return response.data;
    })
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
  } catch (error) {}
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
  try {
    const response = await axios.get(`${BASE_URL}/getMember`, {
      params: { memberId },
    });

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
    const response = await axios.delete(
      `${BASE_URL}/deleteAccount/${memberId}`
    );
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

// 자동로그인
export async function autoLogin() {
  try {
    const response = await api.get("/getAutoLogin");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
