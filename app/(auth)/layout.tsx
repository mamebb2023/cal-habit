"use client";

import { useUserContext } from "@/context/UserContext"; // Adjust the path if needed
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const { user } = useUserContext(); // Access the user from context

  useEffect(() => {
    // If user is already logged in, redirect to /habits
    if (user) {
      router.push("/habits");
    }
  }, [user, router]); // Depend on user and router to trigger on change

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full z-0 bg-linear-to-r from-color-primary via-color-secondary to-color-tertiary">
        <div className="absolute inset-0 bg-linear-to-b from-white via-white/70 to-transparent" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname} // Unique key for animations on route change
          initial={{ opacity: 0, scale: 0.95 }} // Start with lower opacity and translateY
          animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and original position
          className="h-screen w-full flex-center flex-col px-4 relative z-10"
        >
          {children}
          <Link
            href="/"
            className="text-sm text-white flex-center gap-2 px-3 py-1 hover:bg-white/50 rounded-full transition-all mt-3"
          >
            <BsArrowLeft size={16} /> Back to Home
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
