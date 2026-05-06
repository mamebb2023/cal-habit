import type { Metadata } from "next";
import "./globals.css";
import { Lexend } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import ReactLenis from "lenis/react";
import { Toaster } from "react-hot-toast";

const font = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

export const metadata: Metadata = {
  title: "CalHabit | Track my habits",
  description: "A website to track my habits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} ${font.variable} antialiased overflow-x-hidden bg-white text-gray-900`}
      >
        <ReactLenis root>
          <UserProvider>
            <div className="relative h-screen w-screen z-10">{children}</div>
            <Toaster />
          </UserProvider>
        </ReactLenis>
      </body>
    </html>
  );
}
