"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


import MenuTopo from "@/components/menu-topo/MenuTopo";
import { ToastProvider } from "@/components/ui/toast-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isLogin = pathname.startsWith('/login');

  // Fallback para evitar hydration flash
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          {mounted ? (
            <>
              {!isLogin && <MenuTopo />}
              <QueryClientProvider client={queryClient}>
                <ToastProvider>
                  <main>{children}</main>
                </ToastProvider>
              </QueryClientProvider>
            </>
          ) : (
            <div className="w-screen h-screen flex items-center justify-center bg-white dark:bg-gray-900">
              <span className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></span>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
