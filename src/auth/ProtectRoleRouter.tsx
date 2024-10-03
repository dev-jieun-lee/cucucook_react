import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const ProtectRoleRouter = () => {
  const { user, isLoggedIn } = useAuth();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);

  //관리자권한
  const isAuth = isLoggedIn && (user?.role === "0" || user?.role === "2");

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
      text: t("CODE.E_ROLE"),
      showConfirmButton: true,
      confirmButtonText: t("text.check"),
    });
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
