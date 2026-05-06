import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateName(name: string): boolean {
  // Name must be between 3 and 20 characters
  return name.length >= 2 && name.length <= 20;
}

export function validateEmail(email: string): boolean {
  // Email must be a valid email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Password must be between 8 and 20 characters
  const passwordRegex = /^.{8,20}$/;
  return passwordRegex.test(password);
}

export const getDaysForMonth = (year: number, month: number) => {
  // Get the exact days for the month in that year
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const firstWeekday = firstDay === 0 ? 6 : firstDay - 1;

  return Array.from({ length: firstWeekday })
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
};

export function getLastTwoDigits(string: string): string {
  // Return the last two digits of a string (e.g. 2024 -> 24)
  return string.slice(-2);
}

export type User = { _id: string; name: string; email: string };

export function getUserFromToken(): User | null {
  // Function to decode a token form localhost and decode the user's info

  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return jwtDecode<User>(token);
  } catch (error) {
    console.error("Error retrieving or decoding token:", error);
    return null;
  }
}

export function miniText(min: number, text?: string | undefined) {
  if (!text) return '';

  if (text.length > min) {
    return `${text.slice(0, min)}...`
  }
  return text
}

export function logout() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("habits");
  window.location.href = "/"
}
