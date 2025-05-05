"use client";
import { useEffect, useState } from "react";

export interface User {
  id: number;
  email: string;
  name: string;
  cod: number;
  tipo: string;
  mvvm: string;
  codcargo: number;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Não autenticado");
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return { user, loading };
}
