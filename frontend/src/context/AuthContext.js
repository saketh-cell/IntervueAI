"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { loginUser, registerUser, logoutUser, getProfile } from "@/src/services/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    let alive = true;

    const init = async () => {
      try {
        const res = await getProfile();

        if (!alive) return;
        setUser(res.user);
      } catch (e) {
        if (!alive) return;
        setUser(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    init();

    return () => {
      alive = false;
    };
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);
    setUser(res.user);
    return res;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};