import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const ProtectAuthRouter = () => {
  const { isLoggedIn } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  //로그인권한
  const isAuth = isLoggedIn;
  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    Swal.fire({
      icon: "error",
      title: t("text.error"),
      text: t("CODE.E_AUTH"),
      showConfirmButton: true,
      confirmButtonText: t("text.check"),
    });

    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
