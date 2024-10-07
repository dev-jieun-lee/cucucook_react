import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import Swal from "sweetalert2";

// 에러 처리 유틸리티 함수
export const handleApiError = (
  error: any,
  navigate: NavigateFunction,
  t: any
) => {
  if (axios.isAxiosError(error) && error.response) {
    // 401 에러, 403 에러
    if (error.response.status === 401 || error.response.status === 403) {
      Swal.fire({
        icon: "error",
        title: t("text.error"),
        text: t(`CODE.${error.response.data.message}`),
        showConfirmButton: true,
        confirmButtonText: t("text.check"),
      }).then(() => {
        navigate("/login");
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
