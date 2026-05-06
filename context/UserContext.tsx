"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
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
  logout: () => void; // Add logout function to context
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user from token when component mounts
  useEffect(() => {
    const userFromToken = getUserFromToken();
    if (userFromToken) {
      setUser(userFromToken);
    }
  }, []);

  // Logout function clears user data, token, and other session data
  const logout = () => {
    // Clear local storage and session storage
    localStorage.removeItem("token");
    sessionStorage.removeItem("habits");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Clear cookie

    // Set user to null
    setUser(null);

    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Helper function to get user from token (with the try-catch block)
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

// Custom hook to access user context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
