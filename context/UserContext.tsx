"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (data: User | null) => void;
  logout: () => void;
  refreshUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await Promise.resolve(); // yield so React renders the loading state
    const userFromToken = getUserFromToken();
    setUser(userFromToken ?? null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    setIsLoading(true);
    await Promise.resolve();
    localStorage.removeItem("token");
    sessionStorage.removeItem("habits");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setIsLoading(false);
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export function getUserFromToken(): User | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return jwtDecode<User>(token);
  } catch (error) {
    console.error("Error retrieving or decoding token:", error);
    return null;
  }
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};