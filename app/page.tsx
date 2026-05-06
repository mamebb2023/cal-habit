"use client";

import React from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Page;
