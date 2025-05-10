"use client";
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import { LoadingScreen } from "@/components/loading-screen copy";

export default function LoginPage() {
  const [showLoading, setShowLoading] = useState(true);

  return showLoading ? (
    <LoadingScreen onFinishLoading={() => setShowLoading(false)} />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700 dark:from-gray-950 dark:to-gray-900">
      <div className="bg-gray-900 dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">SISCOP</h1>
        <span className="text-gray-300 mb-4 text-sm">Sistema de Controle de processos</span>
        <LoginForm />
        <span className="text-xs text-gray-500 mt-8">© 2025 SISCOP - Todos os direitos reservados</span>
      </div>
    </div>
  );
}
