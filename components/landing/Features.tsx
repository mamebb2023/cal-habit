"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BiCalendarCheck,
  BiTrophy,
  BiBarChartAlt2,
  BiBell,
  BiLock,
  BiDevices,
  BiStar,
} from "react-icons/bi";

const features = [
  {
    icon: <BiCalendarCheck />,
    title: "Track Daily Habits",
    description:
      "Mark your habits daily and build consistency with our intuitive calendar view.",
  },
  {
    icon: <BiTrophy />,
    title: "Achieve Goals",
    description:
      "Set goals and track your progress with visual indicators and statistics.",
  },
  {
    icon: <BiBarChartAlt2 />,
    title: "View Analytics",
    description:
      "Get insights into your habit patterns with detailed analytics and reports.",
  },
  {
    icon: <BiBell />,
    title: "Stay Reminded",
    description:
      "Never miss a habit with customizable reminders and notifications.",
  },
  {
    icon: <BiLock />,
    title: "Secure & Private",
    description:
      "Your data is encrypted and secure. Your habits, your privacy.",
  },
  {
    icon: <BiDevices />,
    title: "Cross-Platform",
    description: "Access your habits anywhere, anytime, on any device.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 py-16 sm:py-20"
    >
      <div className="max-w-7xl w-full mx-auto flex-center flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-color-primary bg-white/80 backdrop-blur-xs shadow-xs mb-6"
        >
          <BiStar className="size-3.5 sm:size-4 text-color-primary shrink-0" />
          <span className="text-color-primary">Features</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gray-900 px-4">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500">
              Everything You Need
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Powerful features to help you build and maintain your habits
            effectively
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 
                         border border-gray-200 
                         hover:border-cyan-500/50 hover:shadow-xl 
                         transition-all duration-300
                         hover:scale-[1.02] sm:hover:scale-105
                         group cursor-pointer"
            >
              <div
                className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 
                              text-cyan-500
                              group-hover:text-indigo-500
                              transition-all duration-300"
              >
                {feature.icon}
              </div>
              <h3
                className="text-sm sm:text-base md:text-lg lg:text-xl 
                             font-semibold mb-1.5 sm:mb-2 text-gray-900 
                             group-hover:bg-clip-text group-hover:text-transparent 
                             group-hover:bg-linear-to-r group-hover:from-cyan-500 
                             group-hover:to-indigo-500 transition-all duration-300"
              >
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
