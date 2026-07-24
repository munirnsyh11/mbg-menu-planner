import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import WireframeStudio from "@/pages/WireframeStudio";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import AdminLayout from "@/components/admin/AdminLayout";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Foods from "@/pages/admin/Foods";
import Nutritions from "@/pages/admin/Nutritions";
import Clustering from "@/pages/admin/Clustering";
import Menus from "@/pages/admin/Menus";
import MenuWorkspace from "@/pages/admin/MenuWorkspace";
import Feedback from "@/pages/admin/Feedback";
import Profile from "@/pages/admin/Profile";

import "@/App.css";

function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function HomeRedirect() {
  const { token } = useAuth();
  return <Navigate to={token ? "/admin" : "/admin/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" theme="light" richColors />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          {/* Wireframe Studio (kept) */}
          <Route path="/wireframes" element={<WireframeStudio />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="foods" element={<Foods />} />
            <Route path="nutritions" element={<Nutritions />} />
            <Route path="clustering" element={<Clustering />} />
            <Route path="menus" element={<Menus />} />
            <Route path="menus/new" element={<MenuWorkspace />} />
            <Route path="menus/:id" element={<MenuWorkspace />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
