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
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isLogin = pathname.startsWith('/login');
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch { /* ignore */ }
          `,
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isLogin && <MenuTopo />}
        {/** Provider do React Query engloba toda a aplicação para hooks useQuery/useMutation */}
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <main>{children}</main>
          </ToastProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
