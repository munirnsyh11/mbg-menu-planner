import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { mbgApi } from "@/lib/mbg-api";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/mbg";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await mbgApi.post("/api/auth/login", { email, password });
      const { token: newToken, user: newUser } = res.data?.data ?? {};
      if (!newToken || !newUser) throw new Error("Respons login tidak valid");

      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      toast.success(`Selamat datang, ${newUser.name}!`);
      return newUser;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Tidak bisa terhubung ke server MBG. Pastikan REACT_APP_MBG_API_URL benar."
          : err.message || "Login gagal");
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await mbgApi.post("/api/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setToken(null);
      setUser(null);
      toast.success("Anda telah keluar.");
    }
  }, []);

  // Verify token on mount
  useEffect(() => {
    if (!token) return;
    mbgApi
      .get("/api/auth/me")
      .then((res) => {
        const u = res.data?.data?.user;
        if (u) {
          setUser(u);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
        }
      })
      .catch(() => {
        // Token invalid – clean up
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setToken(null);
        setUser(null);
      });
  }, [token]);

  useEffect(() => {
    const handle = () => {
      setToken(null);
      setUser(null);
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
    };
    window.addEventListener("mbg:unauthorized", handle);
    return () => window.removeEventListener("mbg:unauthorized", handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
