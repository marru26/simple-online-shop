
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isMerchant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser });
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/api/login", { email, password });
      const { token, user: userData } = response.data;
      if (!token || !userData) {
        throw new Error("Login gagal: token atau user tidak ditemukan");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ ...userData }));
      setUser({ ...userData });
      toast.success("Login berhasil");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Login gagal");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logout berhasil");
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/api/register", { name, email, password });
      toast.success("Registrasi berhasil, silakan login");
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Registrasi gagal");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        isMerchant: !!user && user.role === "merchant",
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
