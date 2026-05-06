"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useUserContext } from "@/context/UserContext";
import { BiLogOutCircle } from "react-icons/bi";

const Header = () => {
  const { user, logout } = useUserContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#testimonial", label: "Testimonial" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md bg-white/60 shadow-xs" : "bg-transparent"
      }`}
    >
      <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-4 items-center flex justify-between">
        <Link href="/" className="transition-transform hover:scale-105">
          <Image
            src="/logo.png"
            alt="CalHabit Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-black transition-colors px-3 py-2 rounded-lg text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <nav className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>
              <Button variant="primary">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary">
                <Link href="/habits">My Habits</Link>
              </Button>
              <button
                className="flex-center size-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full border border-gray-300 cursor-pointer transition-all hover:scale-110"
                onClick={logout}
                title="Logout"
              >
                <BiLogOutCircle className="text-xl text-gray-700" />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
