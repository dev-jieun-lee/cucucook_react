import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { id: string; name: string } | null;
  setUser: (user: { id: string; name: string } | null) => void;
  isLoggedIn: boolean;
  setLoggedIn: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};