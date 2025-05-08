"use client";
import React, { useState } from "react";
import Link from "next/link";
import UserMenu from "../user/UserMenu";

const menus = [
  { label: "Administração", href: "#" },
  { label: "Cadastro", href: "#" },
  {
    label: "Gerência",
    href: "#",
    submenu: [
      { label: "Controle de Processos", href: "#" },
      { label: "Lib. Fatur. Gerência", href: "#" },
      { label: "Lib. Fixa. Gerência", href: "#" },
      { label: "Copia de Conf. p/ outro imóvel", href: "#" },
      { label: "Copia de Conf. p/ vários imóveis", href: "#" },
    ],
  },
  { label: "Técnico", href: "#" },
  { label: "Consultas", href: "#" },
];

// Removido import duplicado de React acima

import { usePathname } from "next/navigation";

export default function MenuTopo() {
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const pathname = usePathname();
  if (pathname.startsWith('/login')) return null;

  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        {/* Nome do sistema */}
        <span className="font-extrabold text-2xl text-gray-900 dark:text-gray-100 tracking-tight select-none">Siscop</span>
        {/* Menu central */}
        <nav className="flex gap-2 ml-8">
          {menus.map(menu =>
            menu.submenu ? (
              <div
                key={menu.label}
                className="relative"
                onMouseEnter={() => setSubmenuOpen(menu.label)}
                onMouseLeave={() => setSubmenuOpen(null)}
              >
                <button
                  className={`px-4 py-2 font-semibold rounded-t text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none ${submenuOpen === menu.label ? "bg-white dark:bg-gray-900 border-b-0 border-x border-t border-gray-300 dark:border-gray-700" : ""}`}
                >
                  {menu.label}
                </button>
                {/* Dropdown */}
                {submenuOpen === menu.label && (
                  <div className="absolute left-0 mt-0 w-64 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-b z-20 animate-fade-in">
                    <ul className="py-2">
                      {menu.submenu.map((item) => (
  <li key={item.label}>
    {item.label === "Controle de Processos" ? (
      <Link
        href="/gerencia/process-control"
        className="block px-6 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[15px]"
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        className="block px-6 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-[15px]"
      >
        {item.label}
      </a>
    )}
  </li>
  ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <a
                key={menu.label}
                href={menu.href}
                className={`px-4 py-2 font-semibold rounded text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors`}
              >
                {menu.label}
              </a>
            )
          )}
        </nav>
        {/* Usuário à direita */}
        <div className="flex items-center ml-8">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

