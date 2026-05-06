"use client";

import SideBar from "@/components/SideBar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative h-screen overflow-hidden bg-gray-50 p-2">
      <SideBar />

      <div className="relative overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
