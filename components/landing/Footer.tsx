"use client";

import { Fleur_De_Leah } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const font = Fleur_De_Leah({ subsets: ["latin"], weight: "400" });

const Footer = () => {
  return (
    <footer className="relative h-[200px] md:h-[370px] overflow-hidden px-6 lg:px-12">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full z-0 bg-linear-to-r from-color-primary via-color-secondary to-color-tertiary">
        <div className="absolute inset-0 bg-linear-to-b from-white via-white/90 to-transparent" />
      </div>

      <div className="relative flex items-center flex-col gap-5  md:px-12 lg:px-20 xl:px-32 py-6 border-t border-gray-200">
        <div className="flex-1 w-full md:w-6xl flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="CalHabit Logo"
            width={120}
            height={40}
            className="h-12 w-auto"
          />

          <div className="space-x-4">
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

        <h1
          className={`text-[7em] md:text-[20em] leading-normal text-white ${font.className}`}
        >
          CalHabit
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
