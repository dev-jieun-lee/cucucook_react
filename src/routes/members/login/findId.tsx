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
import axios from 'axios';
import { Wrapper } from '../../../styles/CommonStyles';
import { LoginWrapper } from './LoginStyle';

function FindId({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [verificationTimeout, setVerificationTimeout] = React.useState<number | null>(null);
  const [loginError, setLoginError] = React.useState<string | null>(null); // 오류 메시지 상태
  const [foundId, setFoundId] = React.useState<string | null>(null); // 찾은 아이디 상태
  const [showVerificationBox, setShowVerificationBox] = React.useState(false);
  const [timer, setTimer] = React.useState<number>(0);

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      verificationCode: '',
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t('members.name_required'); // 이름이 빈 경우
      if (!values.phoneNumber) errors.phoneNumber = t('members.phone_number_required'); // 휴대폰 번호가 빈 경우
      if (showVerificationBox && !values.verificationCode) errors.verificationCode = t('members.verification_code_required'); // 인증번호가 빈 경우
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:8080/api/members/find-id', {
          name: values.name,
          phoneNumber: values.phoneNumber,
          verificationCode: values.verificationCode,
        });

        if (response.data.foundId) {
          setFoundId(response.data.foundId);
          setLoginError(null);
        } else {
          setFoundId(null);
          setLoginError(t('members.no_member_info')); // 등록된 회원정보가 없는 경우
        }
      } catch (error) {
        console.error('아이디 찾기 오류: ', error);
        setLoginError(t('members.unexpected_error')); // 예상치 못한 오류 발생
      }
    },
  });

  const handleVerifyClick = () => {
    if (formik.values.name && formik.values.phoneNumber) {
      setShowVerificationBox(true);
      setVerificationTimeout(Date.now() + 60000); // Set timeout to 1 minute
      setTimer(60); // Initialize timer
    } else {
      setLoginError(t('members.name_or_phone_required')); // 이름 또는 전화번호 입력이 필요한 경우
    }
  };

  const handleConfirmClick = () => {
    if (!formik.values.verificationCode) {
      setLoginError(t('members.verification_code_required')); // 인증번호가 빈 경우
    } else {
      // 인증번호 확인 로직을 구현.
      // 이 부분은 인증 서버와 연동하여 인증을 처리하는 코드가 필요.
    }
  };

  React.useEffect(() => {
    if (verificationTimeout) {
      const interval = setInterval(() => {
        if (Date.now() > verificationTimeout) {
          clearInterval(interval);
          setVerificationTimeout(null); // Stop the timer
          setTimer(0); // Reset timer
        } else {
          setTimer(Math.max(0, Math.floor((verificationTimeout - Date.now()) / 1000))); // Update timer
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [verificationTimeout]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
              onChange={formik.handleChange}
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
                onChange={formik.handleChange}
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
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Numeric input only
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
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            {t("members.find_id")}
          </Button>
        </form>

        {/* 아이디 찾기 결과 표시 */}
        {foundId && (
          <Typography variant="body1" color="text.primary" sx={{ mt: 2 }}>
            {t("members.found_id_message", { id: foundId })}
          </Typography>
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
