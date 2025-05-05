"use client";

import Image from "next/image";
import { useUser } from "@/hooks/useUser";

const shortcuts = [
  { label: "Novo Processo", icon: (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3b82f6"/><path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
  ), href: "#" },
  { label: "Meus Processos", icon: (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" fill="#16a34a" rx="3"/><path d="M6 9h8M6 13h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
  ), href: "#" },
  { label: "Consultas", icon: (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="#f59e42"/><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
  ), href: "#" },
  { label: "Usuários", icon: (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="8" r="4" fill="#8b5cf6"/><rect x="14" y="14" width="6" height="6" rx="3" fill="#8b5cf6"/></svg>
  ), href: "#" },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
        Bem-vindo ao Sistema de Controle de Processos
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-300 text-center">
        Selecione uma opção no menu superior para começar
      </p>
    </main>
  );
}


