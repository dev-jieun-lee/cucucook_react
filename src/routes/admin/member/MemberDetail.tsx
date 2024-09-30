import { useTranslation } from "react-i18next";
import { Wrapper } from "../../../styles/CommonStyles";
import { LoginWrapper } from "../../../styles/LoginStyle";
import PersonIcon from "@mui/icons-material/Person";
import { FormControl, InputAdornment, MenuItem, Select, TextField } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { getMember } from "../../../apis/memberApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loading from "../../../components/Loading";
import { updateMember, updateUserInfo } from "../../../apis/mypageApi";

function MemberDetail(){
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const { memberId } = useParams();
  const [loading, setLoading] = useState(true);

  const emailDomains = [
    { value: "gmail.com", label: "gmail.com" },
    { value: "naver.com", label: "naver.com" },
    { value: "daum.net", label: "daum.net" },
    { value: "custom", label: t("members.custom_input") },
  ];

  // 전화번호 포맷 함수
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // 숫자만 추출
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  };

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

  console.log(memberData);

  // const mutation = useMutation(updateMember(memberId, values),
  //   {
  //     onSuccess: (data) => {
  //       Swal.fire({
  //         icon: "success",
  //         title: t("text.save"),
  //         text: t("menu.board.alert.save"),
  //         showConfirmButton: true,
  //         confirmButtonText: t("text.check"),
  //       });
  //       navigate(-1);
  //     },
  //     onError: (error) => {
  //       // 에러 처리
  //     },
  //   }
  // );
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      memberId: memberId,
      userId : memberData?.userId,
      name: memberData?.name,
      phone: memberData?.phone,
      email: memberData?.email,
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      boardCategoryId: Yup.string().required(),
      contents: Yup.string().required(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      // mutation.mutate(values as any); // mutation 실행
    },
  });

  //로딩
  if (loading || memberLoading) {
    return <Loading />;
  }


  return(
    <Wrapper>
      <LoginWrapper>
        <div className="title">
          <PersonIcon className="title-icon" />
          <span>{t("menu.admin.members_info")}</span>
        </div>
        <form >
          <FormControl className="input-form">
              <TextField
                id="userId"
                name="userId"
                label={t("text.user_id")}
                disabled
                value={formik.values.userId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.userId && Boolean(formik.errors.userId)}
                // helperText={formik.touched.userId && formik.errors.userId}
              />
          </FormControl>
          <FormControl className="input-form">
              <TextField
                id="userName"
                name="userName"
                label={t("text.name")}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                // helperText={formik.touched.password && formik.errors.password}
              />
          </FormControl>
          <FormControl className="input-form">
              <TextField
                id="phone"
                name="phone"
                label={t("mypage.phone_number")}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                // helperText={formik.touched.password && formik.errors.password}
              />
          </FormControl>
          <FormControl className="input-form">
            <div className="input-email">
              <TextField
                className="email"
                id="emailLocalPart"
                name="emailLocalPart"
                label={t("text.email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">@</InputAdornment>
                  ),
                }}
              />
              <Select
                className="email-select"
                id="emailDomain"
                name="emailDomain"
                // value={formik.values.emailDomain}
                // onChange={(e) => {
                //   formik.handleChange(e);
                //   if (e.target.value !== "custom") {
                //     setCustomDomain("");
                //   }
                // }}
              >
                {emailDomains.map((domain) => (
                  <MenuItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </FormControl>
        </form>
      </LoginWrapper>
    </Wrapper>
  );
}

export default MemberDetail;