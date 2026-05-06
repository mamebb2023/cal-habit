"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";

interface GradientOrbCTAProps {
  href: string;
  text: string;
  className?: string;
}

const GradientOrbCTA: React.FC<GradientOrbCTAProps> = ({
  href,
  text,
  className = "",
}) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href}>
        <motion.div
          className="relative group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Animated gradient orb background */}
          <div className="relative overflow-hidden rounded-full p-[2px] bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500">
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Inner content */}
            <div className="relative bg-white rounded-full px-7 py-4 flex items-center gap-3 group-hover:bg-gray-50 transition-colors">
              <span className="text-gray-900 font-semibold text-md md:text-lg">
                {text}
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BsArrowRight className="w-5 h-5 text-gray-900" />
              </motion.div>
            </div>

            {/* Glowing effect */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 -z-10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Floating particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-linear-to-r from-cyan-400 to-blue-400 opacity-60"
              style={{
                width: `${8 + i * 4}px`,
                height: `${8 + i * 4}px`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, (i - 1) * 15, 0],
                opacity: [0.6, 0.3, 0.6],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default GradientOrbCTA;
