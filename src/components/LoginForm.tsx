"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { LOCAL_STORAGE_TOKEN_KEY } from '@/lib/constants';

export default function LoginForm() {
  const [email, setEmail] = useState("mauro@ameni.com.br");
  const [password, setPassword] = useState("$Gbgb");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Usuário ou senha inválidos.");
      }
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.access_token);
      }
      // Redireciona para a tela principal
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleLogin}>
      <label className="block text-gray-300 text-sm mb-1 mt-2" htmlFor="email">E-mail</label>
      <input
        id="email"
        type="email"
        autoComplete="email"
        className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        placeholder="seu.email@exemplo.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <label className="block text-gray-300 text-sm mb-1 mt-2" htmlFor="password">Senha</label>
      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-200 focus:outline-none"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#cbd5e1" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm-1-5a1 1 0 112 0 1 1 0 01-2 0Z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#cbd5e1" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm-1-5a1 1 0 112 0 1 1 0 01-2 0Z"/><line x1="4" y1="4" x2="20" y2="20" stroke="#cbd5e1" strokeWidth="2"/></svg>
          )}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-4 transition-colors duration-200 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
