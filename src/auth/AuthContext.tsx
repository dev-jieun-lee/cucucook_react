import { Cookie } from "@mui/icons-material";
import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { autoLogin } from "../apis/memberApi";

interface AuthContextType {
  user: {
    userId?: string;
    name: string;
    role?: string;
    memberId: number;
  } | null;
  setUser: (
    user: {
      userId?: string;
      name: string;
      role?: string;
      memberId: number;
    } | null
  ) => void;
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    userId?: string;
    name: string;
    role?: string;
    memberId: number;
  } | null>(null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  // 컴포넌트가 처음 렌더링될 때 로그인 상태를 확인
  useEffect(() => {
    const rememberLogin = Cookies.get("remember_login");
    const storedUser = sessionStorage.getItem("user");
    const handleAutoLogin = async () => {
      try {
        //자동로그인 체크상태인데 session에 값이 없다면 로그인
        if (rememberLogin && !storedUser) {
          const response = await autoLogin();
          if (response) {
            setUser({
              userId: response.userId,
              name: response.name,
              role: response.role,
              memberId: response.memberId,
            });
            setLoggedIn(true);
          }
        } else if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setLoggedIn(true);
        }
      } catch (error) {}
    };

    handleAutoLogin();
  }, [setUser, setLoggedIn]);

  // 사용자 정보가 변경될 때 sessionStorage에 저장
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
