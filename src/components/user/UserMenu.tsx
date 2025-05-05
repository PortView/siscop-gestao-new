"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/hooks/useUser";

export default function UserMenu() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }
  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-20 h-3 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
        <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end mr-2">
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-none">{user.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{user.tipo}</span>
      </div>
      <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg select-none">
        {user.name.charAt(0)}
      </div>
      <button
        onClick={toggleTheme}
        title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        className="ml-1 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
      >
        {theme === "dark" ? (
          // Ícone Sol (modo claro)
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#fbbf24"/><g stroke="#fbbf24" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></g></svg>
        ) : (
          // Ícone Lua (modo escuro)
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3c.13 0 .24.09.26.22a.25.25 0 01-.13.27A7 7 0 0020.5 13a.25.25 0 01.27.13c.04.11-.03.23-.16.26Z" fill="#64748b"/></svg>
        )}
      </button>
      <button
        onClick={handleLogout}
        title="Sair"
        aria-label="Sair"
        className="ml-1 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#64748b" d="M16 13v-2H7V8l-5 4 5 4v-3h9Z"/><path fill="#64748b" d="M20 19V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4h2V5h10v14H8v-4H6v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Z"/></svg>
      </button>
    </div>
  );
}

