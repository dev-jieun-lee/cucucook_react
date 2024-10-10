import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import Swal from "sweetalert2";

//이미 켜있으면 재호출 안되도록
let isSwalDisplayed = false;

// 에러 처리 유틸리티 함수
export const handleApiError = (
  error: any,
  navigate: NavigateFunction,
  t: any
) => {
  if (isSwalDisplayed) return;

  if (axios.isAxiosError(error) && error.response) {
    // 401 에러, 403 에러
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      isSwalDisplayed = true;
      Swal.fire({
        icon: "error",
        title: t("text.error"),
        text: t(`CODE.${error.response.data.message}`),
        showConfirmButton: true,
        confirmButtonText: t("text.check"),
      }).then(() => {
        isSwalDisplayed = false;
        if (error.response?.status === 403) {
          navigate("/");
        } else {
          navigate("/login");
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: t("text.error"),
        text: t("CODE.E_SERVER_CODE", {
          status: error.response.status,
        }),
        showConfirmButton: true,
        confirmButtonText: t("text.check"),
      }).then(() => {});
    }
  } else {
    Swal.fire({
      icon: "error",
      title: t("text.error"),
      text: t("CODE.E_ADMIN"),
      showConfirmButton: true,
      confirmButtonText: t("text.check"),
    });
  }
};
