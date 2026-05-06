"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getUserFromToken, validateEmail, validatePassword } from "@/lib/utils";
import Link from "next/link";
import { Fleur_De_Leah } from "next/font/google";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BiLock, BiMailSend } from "react-icons/bi";
import { toast } from "react-hot-toast";

const font = Fleur_De_Leah({
  subsets: ["latin"],
  weight: "400",
});

const Page = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address");
    }

    if (!validatePassword(password)) {
      return setError("Password must be at least 8 characters long.");
    }

    setError("");

    // Handle successful login logic here
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token in localStorage or cookies (if you prefer)
        localStorage.setItem("token", data.token); // Store JWT token in localStorage
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`; // Store JWT token in cookie for middleware

        const user = getUserFromToken();
        if (!user) {
          return setError("An error occurred. Please try again.");
        }

        console.log("user", user);

        toast.success(`Welcome back! ${user.name}!`);

        router.push("/habits");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-[92%] max-w-[420px] rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="mb-6">
        <h1 className={`h1 text-[3em] leading-14 ${font.className}`}>Login</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back — let’s get you into your dashboard.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-[.8em]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          ref={emailRef}
          leftIcon={<BiMailSend className="size-4" />}
        />
        <Input
          type={!showPassword ? "password" : "text"}
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          ref={passwordRef}
          leftIcon={<BiLock className="size-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded-lg p-1 text-gray-600 hover:text-black transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="size-4" />
              ) : (
                <FiEye className="size-4" />
              )}
            </button>
          }
        />

        <div className="flex-center mt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={isSubmitting}
          >
            Login
          </Button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-black hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
