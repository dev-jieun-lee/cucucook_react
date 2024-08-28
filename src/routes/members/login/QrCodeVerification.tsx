import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// 플랫폼을 감지하는 함수
const getPlatform = (): "android" | "ios" | "unknown" => {
  const userAgent =
    navigator.userAgent || (navigator as any).vendor || (window as any).opera;

  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "ios";
  }
  return "unknown";
};

const QrCodeVerification = () => {
  const [qrMessage, setQrMessage] = useState("");
  const navigate = useNavigate();

  // 플랫폼에 따라 QR 코드 내용을 설정하는 useEffect
  useEffect(() => {
    const platform = getPlatform();
    let message;

    if (platform === "ios") {
      // iOS용 형식들, 각각 시도해보기
      // message = "sms:verify@obtuse.kr;body=인증 코드를 입력하세요";
      // 또는
      message = "sms:verify@obtuse.kr&body=인증 코드를 입력하세요";
    } else if (platform === "android") {
      // Android용 형식
      message = "sms:verify@obtuse.kr?body=인증 코드를 입력하세요";
    } else {
      message = "sms:verify@obtuse.kr?body=인증 코드를 입력하세요"; // 기본값
    }

    setQrMessage(message);
  }, []);

  // 인증이 완료된 후 돌아오는 함수
  const handleVerificationComplete = () => {
    navigate("/find-id", { state: { verificationComplete: true } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        gap: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        QR 코드를 스캔하여 인증 메시지를 보내세요
      </Typography>
      <QRCode value={qrMessage} size={256} />
      <Typography variant="body1" color="textSecondary">
        QR 코드를 스캔하면 문자 메시지 앱이 열리며, 인증 메시지가 자동으로
        채워집니다.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleVerificationComplete}
      >
        아이디 찾기로 이동
      </Button>
    </Box>
  );
};

export default QrCodeVerification;
