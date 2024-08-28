import axios from "axios";
import { useMutation } from "react-query";

const BASE_URL = "http://localhost:8080/api/members";

// 기본 axios 인스턴스 설정
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//로그인
export async function login(form: any) {
  try {
    const response = await axios.post(`${BASE_URL}/login`, form);
    console.log("로그인 응답데이터", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}
//로그아웃
export async function logout() {
  const response = await axios.post(`${BASE_URL}/logout`);
  console.log("로그아웃 응답데이터", response.data);
  return response.data;
}

//핸드폰번호 중복체크
export async function phoneCheck(form: any) {
  const response = await axios.post(`${BASE_URL}/check-phone`, form);
  console.log("핸드폰번호 중복체크 응답데이터", response.data);
  return response.data;
}

//아이디 중복체크
export async function idCheck(id: string) {
  const response = await axios.get(`${BASE_URL}/check-id/${id}`);
  console.log(
    "아이디중복체크 응답데이터( true -사용가능, false - 사용불가",
    response.data
  );
  return response.data;
}

//회원가입
export async function register(form: any) {
  const response = await axios.post(`${BASE_URL}/register`, form);
  console.log("회원가입 응답데이터", response.data);
  return response.data;
}

// 인증 코드 전송 API
export const useSendVerificationCode = () => {
  return useMutation(async (data: { phone: string; carrier: string }) => {
    const response = await axios.post(`${BASE_URL}/sendVerificationCode`, {
      phone: data.phone,
      carrier: data.carrier, // 통신사 정보 추가
    });
    if (!response.data) {
      throw new Error("Failed to send verification code");
    }
    return response.data;
  });
};

// 인증 코드 검증 API
export const useVerifyCode = () => {
  return useMutation(
    async ({ phoneNumber, code }: { phoneNumber: string; code: string }) => {
      const response = await axios.post(`${BASE_URL}/verify`, {
        phone: phoneNumber,
        code: code,
      });
      if (!response.data) {
        throw new Error("Failed to verify code");
      }
      return response.data;
    }
  );
};

export const findId = async (data: {
  name: string;
  phone: string;
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

export const verifyQrCode = async (qrCode: string) => {
  try {
    const response = await axios.post("/api/verify-qr", { code: qrCode });
    return response.data;
  } catch (error) {
    throw new Error("QR 코드 인증 실패");
  }
};

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
