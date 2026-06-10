import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Apple,
  Activity,
  Network,
  CalendarDays,
  MessageSquare,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const NAV = [
  { to: "/admin",             label: "Dashboard",     Icon: LayoutDashboard, end: true },
  { to: "/admin/foods",       label: "Foods",         Icon: Apple },
  { to: "/admin/nutritions",  label: "Nutrition",     Icon: Activity },
  { to: "/admin/clustering",  label: "Clustering",    Icon: Network },
  { to: "/admin/menus",       label: "Menu Planner",  Icon: CalendarDays },
  { to: "/admin/feedback",    label: "Feedback",      Icon: MessageSquare },
];

function pageTitle(pathname) {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  const item = NAV.find((n) => n.to !== "/admin" && pathname.startsWith(n.to));
  return item?.label || "Dashboard";
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col"
        data-testid="admin-sidebar"
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white grid place-items-center font-bold text-sm tracking-tight">
            MBG
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">MBG Admin</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              Menu Planner
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
                ].join(" ")
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest px-3 mb-1">
            Versi
          </div>
          <div className="text-xs text-slate-500 px-3">MBG v1.0 · Admin</div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header
          className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6"
          data-testid="admin-topbar"
        >
          <div>
            <div className="text-base font-semibold text-slate-900">
              {pageTitle(location.pathname)}
            </div>
            <div className="text-xs text-slate-500">
              Selamat datang di MBG Menu Planner Admin
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              data-testid="user-menu-toggle"
            >
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center font-semibold text-sm">
                {(user?.name || "U").slice(0, 1).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium leading-tight">
                  {user?.name || "User"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {user?.role || "—"}
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-slate-200 shadow-lg z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    data-testid="logout-btn"
                  >
                    <LogOut size={16} />
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Outlet */}
        <main className="flex-1 overflow-y-auto p-6" data-testid="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
