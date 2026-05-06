"use client";

import React from "react";
import { motion } from "framer-motion";
import { useUserContext } from "@/context/UserContext";
import Link from "next/link";
import GradientOrbCTA from "@/components/ui/GradientOrbCTA";

const CTASection = () => {
  const { user } = useUserContext();

  return (
    <section className="relative p-12">
      <div className="mx-auto text-center relative px-10 py-8 rounded-2xl max-w-6xl flex-center flex-col gap-4 border border-color-primary">
        {/* glow */}
        <div className="absolute inset-0 border-6 border-color-primary rounded-2xl blur-xl" />

        {/* CONTENTS */}
        <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500" />

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
        >
          Ready to build{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500">
            better habits?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Join CalHabit today and start turning your intentions into lasting
          routines — one day at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 mt-5"
        >
          <GradientOrbCTA
            href={user ? "/habits" : "/register"}
            text={user ? "Go to My Habits" : "Get Started — It's Free"}
          />
          {!user && (
            <Link
              href="/login"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition underline underline-offset-4"
            >
              Already have an account? Log in
            </Link>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-sm text-gray-400"
        >
          No credit card required &nbsp;·&nbsp; Free forever &nbsp;·&nbsp;
          Cancel anytime
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
