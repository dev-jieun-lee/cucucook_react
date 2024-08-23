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
import { LoginWrapper, ResultBox } from './LoginStyle'; // ResultBox import
import { useMutation } from 'react-query';

// API 호출 함수
const fetchId = async (data: { name: string, phone: string, verificationCode: string }) => {
  const response = await fetch('/api/members/find-id', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('아이디 찾기 오류');
  }

  return response.json();
};

function FindId({ isDarkMode }: { isDarkMode: boolean }) {
  const { t } = useTranslation();
  const [verificationTimeout, setVerificationTimeout] = React.useState<number | null>(null);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [foundId, setFoundId] = React.useState<string | null>(null);
  const [showVerificationBox, setShowVerificationBox] = React.useState(false);
  const [timer, setTimer] = React.useState<number>(0);
  const [noMemberInfo, setNoMemberInfo] = React.useState(false);
  const [verificationComplete, setVerificationComplete] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);

  const { mutate: findId, isLoading: isFindingId, error: findIdError } = useMutation(fetchId, {
    onSuccess: (data) => {
      if (data.foundId) {
        setFoundId(data.foundId);
        setNoMemberInfo(false);
      } else {
        setFoundId(null);
        setNoMemberInfo(true);
      }
      setShowResult(true);
    },
    onError: () => {
      setLoginError(t('members.find_id_error'));
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      verificationCode: '',
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.name) errors.name = t('members.name_required');
      if (!values.phone) errors.phone = t('members.phone_number_required');
      if (showVerificationBox && !values.verificationCode) errors.verificationCode = t('members.verification_code_required');
      return errors;
    },
    onSubmit: async (values) => {
      // 폼 제출 시 별도의 처리는 필요하지 않음
    },
  });

  const handleVerifyClick = () => {
    if (formik.values.name && formik.values.phone) {
      setShowVerificationBox(true);
      setVerificationTimeout(Date.now() + 60000);
      setTimer(60);
      setNoMemberInfo(false);
      setVerificationComplete(false);
      setShowResult(false);
    } else {
      setLoginError(t('members.name_or_phone_required'));
    }
  };

  const handleConfirmClick = () => {
    if (!formik.values.verificationCode) {
      setLoginError(t('members.verification_code_required'));
    } else {
      setVerificationComplete(true);
    }
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

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    formik.setFieldValue('phone', value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^가-힣]/g, '');
    formik.setFieldValue('name', value);
  };

  const handleFindIdClick = async () => {
    if (verificationComplete) {
      findId({
        name: formik.values.name,
        phone: formik.values.phone,
        verificationCode: formik.values.verificationCode,
      });
    } else {
      setLoginError(t('members.verify_first'));
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
            <FormControl className="input-form" sx={{ m: 1, flexGrow: 1 }} variant="outlined" error={!!formik.errors.phone}>
              <InputLabel htmlFor="phone">{t('members.phone_number')}</InputLabel>
              <OutlinedInput
                id="phone"
                label={t('members.phone_number')}
                value={formik.values.phone}
                onChange={handlePhoneNumberChange}
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
            disabled={isFindingId} // 로딩 중 비활성화
          >
            {t("members.find_id")}
          </Button>
        </form>

        {showResult && (
          <ResultBox>
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
          </ResultBox>
        )}

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
