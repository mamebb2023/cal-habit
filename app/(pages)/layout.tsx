"use client";

import SideBar from "@/components/SideBar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-3 relative h-screen overflow-hidden bg-gray-50 p-2 md:p-4">
      <SideBar />

      <div className="flex-1 relative">{children}</div>
    </div>
  );
};

export default Layout;
