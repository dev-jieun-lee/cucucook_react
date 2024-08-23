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
import { useMutation } from 'react-query';
import { Wrapper } from '../../../styles/CommonStyles';
import { LoginWrapper } from './LoginStyle';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

// API 호출 함수
const fetchPassword = async (values: any) => {
  const response = await axios.post('http://localhost:8080/api/members/find-pw', {
    name: values.name,
    phone: values.phone,
    userId: values.userId,
    verificationCode: values.verificationCode,
  });
  console.log('Server Response:', response.data); // 서버 응답 확인용 콘솔 로그
  return response.data;
};

function FindPw({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [verificationTimeout, setVerificationTimeout] = React.useState<number | null>(null);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [showVerificationBox, setShowVerificationBox] = React.useState(false);
  const [timer, setTimer] = React.useState<number>(0);
  const [foundId, setFoundId] = React.useState<string | null>(null);
  const [resultVisible, setResultVisible] = React.useState<boolean>(false); // 결과 박스 표시 상태 변수 추가

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      userId: initialId,
      verificationCode: '',
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t('members.name_required');
      if (!values.phone) errors.phone = t('members.phone_number_required');
      if (!values.userId) errors.userId = t('members.id_required');
      if (showVerificationBox && !values.verificationCode) errors.verificationCode = t('members.verification_code_required');
      return errors;
    },
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  const mutation = useMutation({
    mutationFn: fetchPassword,
    onSuccess: (data) => {
      console.log('Mutation Success Data:', data); // 성공 시 데이터 확인용 콘솔 로그
      console.log('Mutation Success Data:', data); // 성공 시 데이터 확인용 콘솔 로그
      if (data.success && data.foundId) {
        setFoundId(data.foundId);
        setLoginError(null);
      } else {
        setFoundId(null);
        setLoginError(t('members.no_member_info'));
      }
      setResultVisible(true); // 비밀번호 찾기 완료 후 결과 박스 표시
    },
    onError: () => {
      setLoginError(t('members.unexpected_error'));
      setResultVisible(true); // 오류 발생 시 결과 박스 표시
    },
  });

  const handleVerifyClick = () => {
    if (formik.values.name && formik.values.phone && formik.values.userId) {
      setShowVerificationBox(true);
      setVerificationTimeout(Date.now() + 60000);
      setTimer(60);
    } else {
      setLoginError(t('members.name_or_phone_or_id_required'));
    }
  };

  const handleConfirmClick = () => {
    if (!formik.values.verificationCode) {
      setLoginError(t('members.verification_code_required'));
    } else {
      // 인증번호 확인 로직을 구현
    }
  };

  // 한글 자모로 변환하는 함수
  const convertToHangul = (input: string) => {
    const jamo = /[\u3131-\u3163\uac00-\ud7a3]/; // 자음 및 모음 유니코드 범위
    const isHangul = input.split('').every(char => jamo.test(char));
    if (!isHangul) return '';

    return input.split('')
      .filter(char => jamo.test(char))
      .join('');
  };

  // 이름 입력값 정제 함수
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filteredValue = convertToHangul(value);
    formik.setFieldValue('name', filteredValue);
  };

  // 아이디 입력값 정제 함수
  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, ''); // 영어와 숫자만 허용
    formik.setFieldValue('userId', filteredValue);
  };

  // 전화번호 입력값 정제 함수
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^0-9]/g, ''); // 숫자만 허용
    formik.setFieldValue('phone', filteredValue);
  };

  React.useEffect(() => {
    if (verificationTimeout) {
      const interval = setInterval(() => {
        if (Date.now() > verificationTimeout) {
          clearInterval(interval);
          setVerificationTimeout(null);
          setTimer(0);
        } else {
          setTimer(Math.max(0, Math.floor((verificationTimeout - Date.now()) / 1000)));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [verificationTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <Typography variant="h6">{t("members.find_pw")}</Typography>
        </div>

        <form className="form" onSubmit={formik.handleSubmit}>
          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined" error={!!formik.errors.name}>
            <InputLabel htmlFor="name">{t('members.name')}</InputLabel>
            <OutlinedInput
              id="name"
              name="name"
              label={t('members.name')}
              value={formik.values.name}
              onChange={handleNameChange}
              inputProps={{ maxLength: 50 }}
            />
            {formik.errors.name && <FormHelperText error>{formik.errors.name}</FormHelperText>}
          </FormControl>

          <FormControl className="input-form" sx={{ m: 1 }} variant="outlined" error={!!formik.errors.userId}>
            <InputLabel htmlFor="userId">{t('members.id')}</InputLabel>
            <OutlinedInput
              id="userId"
              name="userId"
              label={t('members.id')}
              value={formik.values.userId}
              onChange={handleUserIdChange}
              inputProps={{ maxLength: 50 }}
            />
            {formik.errors.userId && <FormHelperText error>{formik.errors.userId}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FormControl className="input-form" sx={{ m: 1, flexGrow: 1 }} variant="outlined" error={!!formik.errors.phone}>
              <InputLabel htmlFor="phone">{t('members.phone_number')}</InputLabel>
              <OutlinedInput
                id="phone"
                name="phone"
                label={t('members.phone_number')}
                value={formik.values.phone}
                onChange={handlePhoneChange}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 15 }}
              />
              {formik.errors.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
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
                    name="verificationCode"
                    label={t('members.verification_code')}
                    value={formik.values.verificationCode}
                    onChange={formik.handleChange}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
                  {t('members.confirmed')}
                </Button>
              </Box>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
            disabled={mutation.isLoading}
          >
            {t('members.find_pw')}
          </Button>
        </form>

        {/* Result Box */}
        {resultVisible && ( // 결과 박스를 조건부로 렌더링
          <Box sx={{ mt: 2 }}>
            {mutation.isLoading ? (
              <Typography>{t('members.loading')}</Typography>
            ) : (
              <>
                {mutation.isSuccess && foundId ? (
                  <Box>
                    <Typography>{t('members.temp_password_issued')}</Typography>
                    <Typography>
                      <Link to="/login" style={{ textDecoration: 'underline' }}>
                        {t('members.login')}
                      </Link>
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {mutation.isError || loginError ? (
                      <Typography color="error">{loginError || t('members.unexpected_error')}</Typography>
                    ) : (
                      <Typography color="error">{t('members.no_member_info')}</Typography>
                    )}
                    <Typography>
                      <Link to="/find-id" style={{ marginRight: '8px', textDecoration: 'underline' }}>
                        {t('members.find_id')}
                      </Link>
                      <Link to="/sign-up" style={{ textDecoration: 'underline' }}>
                        {t('members.sign_up')}
                      </Link>
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}

        {loginError && (
          <Snackbar open autoHideDuration={6000} onClose={() => setLoginError(null)}>
            <Alert onClose={() => setLoginError(null)} severity="error">
              {loginError}
            </Alert>
          </Snackbar>
        )}
      </LoginWrapper>
    </Wrapper>
  );
}

export default FindPw;
