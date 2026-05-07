"use client";

import { useUserContext } from "@/context/UserContext";
import React from "react";

type SuspenseProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  loading?: boolean;
};

export function Suspense({ children, fallback, loading }: SuspenseProps) {
  const { isLoading } = useUserContext();

  // If loading prop is explicitly provided, use it; otherwise use global auth loading
  const shouldShowFallback = loading !== undefined ? loading : isLoading;

  if (shouldShowFallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}