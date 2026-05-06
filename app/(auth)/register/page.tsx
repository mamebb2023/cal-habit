"use client";

import React, { useRef, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { validateEmail, validatePassword, validateName } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fleur_De_Leah } from "next/font/google";
import { BiLock, BiMailSend, BiUser } from "react-icons/bi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const font = Fleur_De_Leah({
  subsets: ["latin"],
  weight: "400",
});

const Register = () => {
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";

    if (!validateName(name)) {
      setError("Your name must be at least 2 characters long, right?");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    if (!validatePassword(password)) {
      setError("Your password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Confirm your password");
      return;
    }

    setError("");

    // Handle successful registration logic here
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Account created successfully. Please login to continue.",
        );
        router.push("/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-[92%] max-w-[420px] rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="mb-6">
        <h1 className={`h1 text-[3em] leading-14 ${font.className}`}>
          Register
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Create your account in under a minute.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 text-[.8em]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <Input
          type="text"
          label="Name"
          placeholder="Your name"
          autoComplete="name"
          ref={nameRef}
          leftIcon={<BiUser className="size-4" />}
        />
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          ref={emailRef}
          leftIcon={<BiMailSend className="size-4" />}
        />
        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          ref={passwordRef}
          leftIcon={<BiLock className="size-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded-lg p-1 text-gray-600 hover:text-black transition-colors"
              aria-label={showPassword ? "Hide passwords" : "Show passwords"}
            >
              {showPassword ? (
                <FiEyeOff className="size-4" />
              ) : (
                <FiEye className="size-4" />
              )}
            </button>
          }
        />
        <Input
          type={showPassword ? "text" : "password"}
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          ref={confirmPasswordRef}
          leftIcon={<BiLock className="size-4" />}
        />

        <div className="flex-center mt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            isLoading={isSubmitting}
          >
            Create account
          </Button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-black hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
