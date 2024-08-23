import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Alert,
  Box,
  Typography,
  FormHelperText,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import { Wrapper } from '../../../styles/CommonStyles';
import { LoginWrapper } from './LoginStyle';

function FindId({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [verificationTimeout, setVerificationTimeout] = React.useState<number | null>(null); // 인증 타임아웃 상태
  const [loginError, setLoginError] = React.useState<string | null>(null); // 오류 메시지 상태
  const [foundId, setFoundId] = React.useState<string | null>(null); // 찾은 아이디 상태
  const [showVerificationBox, setShowVerificationBox] = React.useState(false); // 인증 입력 박스 표시 여부
  const [timer, setTimer] = React.useState<number>(0); // 타이머 상태
  const [noMemberInfo, setNoMemberInfo] = React.useState(false); // 회원정보가 없는 상태
  const [verificationComplete, setVerificationComplete] = React.useState(false); // 인증 완료 상태
  const [showResult, setShowResult] = React.useState(false); // 결과 표시 여부

  const formik = useFormik({
    initialValues: {
      name: '', // 사용자 이름
      phoneNumber: '', // 전화번호
      verificationCode: '', // 인증번호
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t('members.name_required'); // 이름이 빈 경우
      if (!values.phoneNumber) errors.phoneNumber = t('members.phone_number_required'); // 전화번호가 빈 경우
      if (showVerificationBox && !values.verificationCode) errors.verificationCode = t('members.verification_code_required'); // 인증번호가 빈 경우
      return errors;
    },
    onSubmit: async (values) => {
      // 인증번호 입력 후 처리 로직은 생략
    },
  });

  const handleVerifyClick = () => {
    if (formik.values.name && formik.values.phoneNumber) {
      setShowVerificationBox(true); // 인증 입력 박스 표시
      setVerificationTimeout(Date.now() + 60000); // 1분 타임아웃 설정
      setTimer(60); // 타이머 초기화
      setNoMemberInfo(false); // 회원정보 상태 초기화
      setVerificationComplete(false); // 인증 완료 상태 초기화
      setShowResult(false); // 결과 표시 초기화
    } else {
      setLoginError(t('members.name_or_phone_required')); // 이름 또는 전화번호 입력 필요
    }
  };

  const handleConfirmClick = () => {
    if (!formik.values.verificationCode) {
      setLoginError(t('members.verification_code_required')); // 인증번호 입력 필요
    } else {
      setVerificationComplete(true); // 인증 완료 상태로 변경
    }
  };

  React.useEffect(() => {
    if (verificationTimeout) {
      const interval = setInterval(() => {
        if (Date.now() > verificationTimeout) {
          clearInterval(interval); // 타이머 정지
          setVerificationTimeout(null); // 타임아웃 상태 초기화
          setTimer(0); // 타이머 초기화
        } else {
          setTimer(Math.max(0, Math.floor((verificationTimeout - Date.now()) / 1000))); // 타이머 업데이트
        }
      }, 1000);

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }
  }, [verificationTimeout]);

  // 초를 MM:SS 형식으로 변환
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    formik.setFieldValue('phoneNumber', value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^가-힣]/g, ''); // 한글만 허용
    formik.setFieldValue('name', value);
  };

  const handleFindIdClick = async () => {
    if (verificationComplete) {
      // 실제 회원정보 조회 로직으로 변경
      try {
        // 회원 정보 조회 API 호출 (여기서는 mockup을 사용)
        const response = await fetch('/api/find-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formik.values.name,
            phoneNumber: formik.values.phoneNumber,
            verificationCode: formik.values.verificationCode,
          }),
        });

        const result = await response.json();

        if (result.foundId) {
          setFoundId(result.foundId); // 찾은 아이디 설정
          setNoMemberInfo(false); // 회원정보가 있는 경우
        } else {
          setFoundId(null); // 찾은 아이디 없음
          setNoMemberInfo(true); // 회원정보가 없는 경우
        }
        setShowResult(true); // 결과 표시
      } catch (error) {
        setLoginError(t('members.find_id_error')); // 아이디 찾기 오류
      }
    } else {
      setLoginError(t('members.verify_first')); // 인증을 먼저 완료해야 함
    }
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <Typography variant="h6">{t("members.find_id")}</Typography>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined" error={!!formik.errors.name}>
            <InputLabel htmlFor="name">{t('members.name')}</InputLabel>
            <OutlinedInput
              id="name"
              label={t('members.name')}
              value={formik.values.name}
              onChange={handleNameChange}
            />
            {formik.errors.name && <FormHelperText error>{formik.errors.name}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FormControl className="input-form" sx={{ m: 1, flexGrow: 1 }} variant="outlined" error={!!formik.errors.phoneNumber}>
              <InputLabel htmlFor="phoneNumber">{t('members.phone_number')}</InputLabel>
              <OutlinedInput
                id="phoneNumber"
                label={t('members.phone_number')}
                value={formik.values.phoneNumber}
                onChange={handlePhoneNumberChange}
              />
              {formik.errors.phoneNumber && <FormHelperText error>{formik.errors.phoneNumber}</FormHelperText>}
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              sx={{ flexShrink: 0 }}
              onClick={handleVerifyClick}
            >
              {t('members.verify')}
            </Button>
          </Box>

          {showVerificationBox && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: 2 }}>
                <FormControl className="input-form" sx={{ m: 1, flexGrow: 1 }} variant="outlined" error={!!formik.errors.verificationCode}>
                  <InputLabel htmlFor="verificationCode">{t('members.verification_code')}</InputLabel>
                  <OutlinedInput
                    id="verificationCode"
                    label={t('members.verification_code')}
                    value={formik.values.verificationCode}
                    onChange={formik.handleChange}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // 숫자 입력만 허용
                    endAdornment={
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(timer)}
                        </Typography>
                      </InputAdornment>
                    }
                  />
                  {formik.errors.verificationCode && <FormHelperText error>{formik.errors.verificationCode}</FormHelperText>}
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ flexShrink: 0 }}
                  onClick={handleConfirmClick}
                >
                  {t('alert.confirmed')}
                </Button>
              </Box>
            </>
          )}

          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            type="button"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleFindIdClick}
          >
            {t("members.find_id")}
          </Button>
        </form>

        {/* 아이디 찾기 결과 표시 */}
        {showResult && (
          <Box sx={{ mt: 2 }}>
            {foundId && !noMemberInfo && (
              <Typography variant="body1" color="text.primary">
                {t("members.found_id_message", { id: foundId })}
              </Typography>
            )}
            {noMemberInfo && (
              <Typography variant="body1" color="text.primary">
                {t("members.no_member_info")}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: '8px', mt: 2 }}>
              {foundId && !noMemberInfo && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/login"
                  >
                    {t('members.login')}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/find-pw"
                  >
                    {t('members.find_pw')}
                  </Button>
                </>
              )}
              {noMemberInfo && (
                <Button
                  variant="contained"
                  color="primary"
                  href="/signup"
                >
                  {t('members.join')}
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* 오류 메시지 표시 */}
        <Snackbar
          open={!!loginError}
          autoHideDuration={6000}
          onClose={() => setLoginError(null)}
        >
          <Alert onClose={() => setLoginError(null)} severity="error">
            {loginError}
          </Alert>
        </Snackbar>
      </LoginWrapper>
    </Wrapper>
  );
}

export default FindId;
