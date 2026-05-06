"use client";

import React from "react";
import { useUserContext } from "@/context/UserContext";
import { motion } from "framer-motion";
import GradientOrbCTA from "@/components/ui/GradientOrbCTA";
import Image from "next/image";
import { BsMoonStars } from "react-icons/bs";

const Hero = () => {
  const { user } = useUserContext();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex justify-center px-4 sm:px-6 pt-14 sm:pt-16 md:pt-20 min-h-screen pb-12 sm:pb-16"
    >
      {/* bg decorations */}
      <div className="absolute inset-0 flex-center md:opacity-70">
        <div className="rotate-360 absolute top-16 flex-center size-[600px] md:size-[1000px] bg-linear-to-r from-cyan-300 via-blue-300 to-indigo-300 rounded-full flex-center">
          <div className="size-[70%] bg-white rounded-full" />
        </div>
        <div className="absolute top-1/4 -left-40 backdrop-blur-3xl size-[400px] md:size-[800px] rounded-full" />
        <div className="absolute top-10 -right-40 blur-[100px] size-[600px] md:size-[800px] bg-white rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center gap-4 sm:gap-5 md:gap-6"
        >
          {/* tag */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-color-primary bg-white/80 backdrop-blur-xs shadow-xs"
          >
            <BsMoonStars className="size-3.5 sm:size-4 text-color-primary shrink-0" />
            <span className="text-color-primary">
              Excellence, then, is not an act, but a habit
            </span>
          </motion.div>

          {/* headline */}
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 px-2">
            <p className="mb-1 sm:mb-2">
              Uplift Your{" "}
              <span className="inline-block text-white px-2 sm:px-3 rounded-lg pb-0.5 sm:pb-1 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-lg">
                Productivity
              </span>
              ,
            </p>
            <p className="mt-2 sm:mt-3">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500">
                Simplify
              </span>{" "}
              Your Life
            </p>
          </div>

          {/* desc */}
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl lg:max-w-3xl leading-relaxed px-4 sm:px-6">
            We&apos;re here to simplify your daily life by providing a clean,
            user-friendly platform that helps you easily track, manage, and
            build better habits over time.
          </p>

          {/* button cta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-4 sm:gap-6 mt-2 sm:mt-4"
          >
            {user ? (
              <GradientOrbCTA href="/habits" text="My Habits" />
            ) : (
              <GradientOrbCTA href="/register" text="Get Started Free" />
            )}
          </motion.div>

          {/* Hero Image - Improved responsive design */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative w-full
                       max-w-[500px] h-[290px] 
                       md:max-w-[700px] md:h-[410px] 
                       lg:max-w-[900px] lg:h-[525px] 
                       xl:max-w-[1100px] xl:h-[640px] 
                       border border-gray-300 bg-gray-50 rounded-xl sm:rounded-2xl 
                       p-3 sm:p-4 md:p-5 flex-center shadow-2xl 
                       hover:shadow-3xl transition-shadow duration-300 mt-4 sm:mt-6"
          >
            {/* Image container */}
            <div className="relative flex-1 w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-white">
              <Image
                src="/image.png"
                alt="Dashboard preview showing habit tracking interface"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 640px) 340px, (max-width: 768px) 500px, (max-width: 1024px) 700px, (max-width: 1280px) 900px, 1100px"
              />
            </div>

            {/* Decorative shine effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent rounded-xl sm:rounded-2xl pointer-events-none"></div>
          </motion.div>

          {/* Optional: Feature highlights below image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <div className="size-1.5 sm:size-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500"></div>
              <span>Easy Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-1.5 sm:size-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500"></div>
              <span>Smart Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-1.5 sm:size-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500"></div>
              <span>Build Consistency</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
