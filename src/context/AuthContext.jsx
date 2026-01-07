import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        return res.data;
      }
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        return res.data;
      }
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // LOAD USER ON APP START
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const res = await api.get("/auth/me");
        if (res.data.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};