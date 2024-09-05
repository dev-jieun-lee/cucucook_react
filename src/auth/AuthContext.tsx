import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  user: { userId: string; name: string; role: string; memberId: number } | null;
  setUser: (
    user: {
      userId: string;
      name: string;
      role: string;
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
    userId: string;
    name: string;
    role: string;
    memberId: number;
  } | null>(null);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

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
