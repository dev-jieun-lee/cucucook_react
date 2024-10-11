import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  FormControl,
  TextField,
} from "@mui/material";
import { activityUserInfoStyles } from "./myPageStyles";

import { useNavigate } from "react-router-dom";
import { TitleCenter, Wrapper } from "../../styles/CommonStyles";
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "react-query";
import { getMember, deleteAccount } from "../../apis/memberApi";
import { useAuth } from "../../auth/AuthContext";
import { changePasswordByUser, updateMember } from "../../apis/mypageApi";
import Cookies from "js-cookie"; // 쿠키를 삭제하기 위해 필요
import { LoginWrapper } from "../../styles/LoginStyle";
import * as Yup from "yup";
import Loading from "../../components/Loading";
import { BoardButtonArea } from "../../styles/BoardStyle";
import {
  ConnectButton,
  PwChangeArea,
  PwChangeButton,
  UserInfoForm,
} from "../../styles/MypageStyle";
import PwChange from "./PwChange";

// UserInfo 컴포넌트
const UserInfo = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); 
  const memberId = user ? user.memberId.toString() : null;
  const [phone, setPhone] = useState("");

  // 데이터 가져오기 시 로딩 상태 추가
  const getMemberWithDelay = async () => {
    setLoading(true); // 로딩 상태 시작

    // 인위적인 지연 시간 추가
    await new Promise((resolve) => setTimeout(resolve, 100));

    const memberData = await getMember(memberId!); // 데이터 불러오기
    setLoading(false);
    return memberData;
  };

  //데이터 받아오기
  const { data: memberData, isLoading: memberLoading } = useQuery(
    "memberData",
    getMemberWithDelay
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: memberData?.userId,
      name: memberData?.name || "",
      phone: memberData?.phone || "",
      email: memberData?.email || "",
      role: memberData?.role || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(t("error.required", { value: t("text.name") }))
        .max(5, t("error.max_length", { value: t("text.name"), length: 5 })),
      phone: Yup.string()
        .required(t("error.required", { value: t("text.phone") }))
        .matches(
          /^\d{3}-\d{3,4}-\d{4}$/,
          t("error.format", { value: t("text.phone") })
        ) // 형식 검증
        .test(
          "len",
          t("error.format", { value: t("text.phone") }),
          (val: any) => val && val.replace(/-/g, "").length === 11
        ), // 13자리 검사
      email: Yup.string()
        .required(t("error.required", { value: t("text.email") }))
        .email(t("error.format", { value: t("text.email") })),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      
      values.phone = values.phone.replace(/-/g, ""); // '-' 제거
      mutation.mutate(values as any); // mutation 실행
    },
  });
  
  const mutation = useMutation(
    (values: any) =>
      updateMember(memberId!, values.name, values.email, values.phone, values.role),
    {
      onSuccess: (data) => {
        // AuthContext에 사용자 정보 업데이트
        setUser({
          userId: user?.userId,
          name: data.name,
          role: user?.role,
          memberId: data.memberId,
        });
        Swal.fire({
          icon: "success",
          title: t("text.save"),
          text: t("menu.board.alert.save"),
          showConfirmButton: true,
          confirmButtonText: t("text.check"),
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.reload();
          }
        });
      },
      onError: (error) => {
        Swal.fire({
          title: t("mypage.update_failed"),
          icon: "error",
          confirmButtonText: t("alert.ok"),
        });
      },
    }
  );

  // 전화번호 포맷 및 유효성 검사
  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 입력한 값에서 숫자만 추출
    const cleaned = value.replace(/\D/g, "");
    // 숫자 11자리를 초과할 경우 자르기
    if (cleaned.length > 11) return;
    // 전화번호 포맷 적용
    const formattedPhone = formatPhoneNumber(cleaned);
    // 폼의 상태 업데이트
    formik.setFieldValue("phone", formattedPhone);
  };

  // 전화번호 포맷 함수
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // 숫자만 남기기
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  };

  useEffect(() => {
    if (memberData) {
      formik.setFieldValue("phone", formatPhoneNumber(memberData.phone));
    }
  }, [memberData]);

  // // 입력된 이름을 한글로 변환하는 함수
  // const convertToHangul = (input: string) => {
  //   const hangulRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
  //   return input.match(hangulRegex)?.join("") || "";
  // };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 이메일에 영문자, 숫자, 특수문자만 허용
    const validEmailRegex = /^[a-zA-Z0-9@._-]*$/;
    if (validEmailRegex.test(value)) {
      formik.setFieldValue("email", value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // const hangulValue = convertToHangul(value); // 한글로 변환
    // formik.setFieldValue("name", hangulValue); // 한글 외의 문자는 자동으로 제거됨
  };

  // 이름, 전화번호, 이메일 중 하나라도 변경되었는지 확인
  const isFormModified =
    formik.values.name !== memberData?.name ||
    formik.values.phone !== memberData?.phone ||
    formik.values.email !== memberData?.email;

  const handleSaveChangesClick = async () => {
    const confirmSave = await Swal.fire({
      title: t("mypage.save_changes"),
      text: t("mypage.save_changes_confirm"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("alert.yes"),
      cancelButtonText: t("alert.no"),
    });

    if (confirmSave.isConfirmed) {
      formik.handleSubmit();
    }
  };

  const handleDeleteAccountClick = async () => {
    const confirmDelete = await Swal.fire({
      title: t("mypage.delete_account"),
      text: t("mypage.delete_account_confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("alert.yes"),
      cancelButtonText: t("alert.no"),
    });

    if (confirmDelete.isConfirmed && memberId) {
      try {
        await deleteAccount(memberId); // 회원 탈퇴 API 호출 (타입 변환 제거)
        Cookies.remove("auth_token"); // 쿠키에 저장된 인증 토큰 삭제 (로그아웃)
        Swal.fire({
          title: t("mypage.account_deleted"),
          icon: "success",
          confirmButtonText: t("alert.ok"),
        });
        navigate("/"); // 성공 후 홈으로 이동
      } catch (error) {
        Swal.fire({
          title: t("mypage.delete_failed"),
          text: t("mypage.delete_account_error"),
          icon: "error",
          confirmButtonText: t("alert.ok"),
        });
      }
    }
  };

  //비밀번호변경 페이지로 이동
  const onClickPwChange = () => {
    navigate(`/mypage/profile/userInfo/passwordChange/${memberId}`);
  };

  //로딩
  if (loading || memberLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <TitleCenter>{t("mypage.profile")}</TitleCenter>
      <LoginWrapper>
        <UserInfoForm onSubmit={formik.handleSubmit}>
          <FormControl className="input-form">
            <TextField
              id="userId"
              name="userId"
              label={t("text.user_id")}
              disabled
              value={formik.values.userId || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userId && Boolean(formik.errors.userId)}
              // helperText={formik.touched.userId && formik.errors.userId}
            />
          </FormControl>
          <FormControl className="input-form">
            <TextField
              id="name"
              name="name"
              label={t("text.name")}
              value={formik.values.name || ""}
              onChange={formik.handleChange}
              // onChange={handleNameChange} // 이름 변경 시 한글만 입력되도록 처리
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={
                formik.touched.name && typeof formik.errors.name === "string"
                  ? formik.errors.name
                  : ""
              }
            />
          </FormControl>
          <FormControl className="input-form">
            <TextField
              id="phone"
              name="phone"
              label={t("mypage.phone_number")}
              value={formik.values.phone || ""}
              onChange={handlePhoneChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={
                formik.touched.phone && typeof formik.errors.phone === "string"
                  ? formik.errors.phone
                  : ""
              }
            />
          </FormControl>
          <FormControl className="input-form">
            <div className="input-email">
              <TextField
                className="email"
                id="email"
                name="email"
                label={t("text.email")}
                value={formik.values.email || ""}
                onChange={handleEmailChange} // 이메일에 문자 제한 추가
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  formik.touched.email &&
                  typeof formik.errors.email === "string"
                    ? formik.errors.email
                    : ""
                }
              />
            </div>
          </FormControl>
          <PwChangeButton
            variant="outlined"
            color="warning"
            onClick={onClickPwChange}
          >
            {t("mypage.change_password")}
          </PwChangeButton>
          <ConnectButton>
            <Button className="con-btn kakao" variant="outlined">
              {t("mypage.connect_kakao")}
            </Button>
            <Button className="con-btn naver" variant="outlined">
              {t("mypage.connect_naver")}
            </Button>
          </ConnectButton>
          <BoardButtonArea>
            <Button
              className="cancel-btn"
              type="button"
              variant="outlined"
              color="warning"
              onClick={() => handleDeleteAccountClick()}
            >
              {t("mypage.delete_account")}
            </Button>
            <Button
              className="save-btn"
              type="submit"
              variant="contained"
              onClick={handleSaveChangesClick}
              disabled={!isFormModified || !formik.isValid}
            >
              {t("text.save")}
            </Button>
          </BoardButtonArea>
        </UserInfoForm>
      </LoginWrapper>
    </Wrapper>
  );
};

export default UserInfo;
