import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useSendEmailVerificationCode,
  useVerifyEmailCode,
} from "../apis/memberApi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// SweetAlert2를 사용하기 위한 설정
const MySwal = withReactContent(Swal);

export function useEmailVerification() {
  const { t } = useTranslation(); // 다국어 지원을 위한 useTranslation 훅
  const [verificationCode, setVerificationCode] = useState<string>(""); // 입력된 인증 코드
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false); // 인증 코드 발송 여부
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false); // 인증 코드 검증 여부
  const [timer, setTimer] = useState<number>(60); // 타이머 값
  const [verificationResult, setVerificationResult] = useState<string | null>(
    null
  ); // 인증 결과 메시지
  const [emailSendResult, setEmailSendResult] = useState<string | null>(null); // 이메일 발송 결과 메시지
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 이메일 인증 코드 발송 Mutation 훅
  const sendVerificationCodeMutation = useSendEmailVerificationCode();

  // 이메일 인증 코드 검증 Mutation 훅
  const verifyCodeMutation = useVerifyEmailCode();

  // 타이머가 주기적으로 감소하도록 설정
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isCodeVerified) {
      if (isCodeSent && timer > 0) {
        interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      } else if (timer === 0) {
        setIsCodeSent(false);
        setIsCodeSent(isCodeVerified);
        setVerificationResult(t("members.verification_code_expired"));
      }
    }

    // 컴포넌트 언마운트 시 interval 정리
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCodeSent, timer, t]);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // 인증 코드 발송 처리 함수
  const handleSendCode = (email: string, skipEmailCheck: boolean) => {
    setIsLoading(true);

    if (!email) {
      alert(t("members.email_required2"));
      setIsLoading(false);
      return;
    } else if (!emailRegex.test(email)) {
      alert(t("members.email_invalid"));
      setIsLoading(false);
      return;
    }

    sendVerificationCodeMutation.mutate(
      { email, skipEmailCheck }, // 객체로 전달
      {
        onSuccess: (data) => {
          setIsCodeSent(true);
          setTimer(60); // 타이머를 60초로 초기화
          setEmailSendResult(t("members.verification_code_sent"));
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("인증 코드 발송 오류:", error); // 오류 콘솔 로그
          setEmailSendResult(t("members.verification_code_error"));
          setIsLoading(false);
        },
      }
    );
  };

  // 인증 코드 검증 처리 함수
  const handleVerifyCode = (email: string, code: string) => {
    verifyCodeMutation.mutate(
      { email, code },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsCodeVerified(true);
            setVerificationResult(t("members.verification_success"));
          } else {
            setVerificationResult(t("members.verification_failed"));
          }
        },
        onError: (error) => {
          console.error("인증 코드 검증 오류:", error); // 오류 콘솔 로그
          setVerificationResult(t("members.verification_error"));
        },
      }
    );
  };

  // 인증 과정 리셋 함수
  const resetVerification = () => {
    setIsCodeSent(false);
    setIsCodeVerified(false);
    setVerificationCode("");
    setTimer(60);
    setVerificationResult(null);
    setEmailSendResult(null);
  };

  // 훅이 반환하는 값
  return {
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isLoading,
    isCodeVerified,
    timer,
    setTimer,
    verificationResult,
    emailSendResult,
    handleSendCode,
    handleVerifyCode,
    resetVerification,
  };
}
