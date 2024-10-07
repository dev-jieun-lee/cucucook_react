import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  user: { userId?: string; name: string; role?: string; memberId: number } | null;
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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setLoggedIn(true);
    }
  }, []);

  // 사용자 정보가 변경될 때 localStorage에 저장
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
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
