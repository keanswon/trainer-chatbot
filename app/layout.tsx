import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col overflow-hidden bg-gray-50">
        <div className="fixed top-0 left-0 w-full z-20">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
          <main className="flex-1 flex flex-col justify-end pb-16">
            {children}
          </main> 
        </div>
      </body>
    </html>
  );
}
