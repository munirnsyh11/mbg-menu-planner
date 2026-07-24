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
  User,
  Database,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const NAV = [
  {
    type: "item",
    to: "/admin",
    label: "Dashboard",
    Icon: LayoutDashboard,
    end: true,
    section: "Overview",
  },
  {
    type: "group",
    label: "Master Data",
    Icon: Database,
    children: [
      { to: "/admin/foods",       label: "Food",      Icon: Apple },
      { to: "/admin/nutritions",  label: "Nutrition", Icon: Activity },
    ],
  },
  {
    type: "item",
    to: "/admin/clustering",
    label: "Clustering",
    Icon: Network,
  },
  {
    type: "item",
    to: "/admin/menus",
    label: "Menu Planner",
    Icon: CalendarDays,
    highlighted: true, // ⭐ main module
    badge: "MAIN",
  },
  {
    type: "item",
    to: "/admin/feedback",
    label: "Feedback",
    Icon: MessageSquare,
  },
  {
    type: "item",
    to: "/admin/profile",
    label: "Profile",
    Icon: User,
  },
];

function pageTitle(pathname) {
  if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
  if (pathname.startsWith("/admin/menus/new")) return "Buat Menu Baru";
  if (pathname.startsWith("/admin/menus/") && pathname !== "/admin/menus")
    return "Detail Menu";
  if (pathname.startsWith("/admin/menus")) return "Menu Planner";
  if (pathname.startsWith("/admin/foods")) return "Food Master Data";
  if (pathname.startsWith("/admin/nutritions")) return "Nutrition Master Data";
  if (pathname.startsWith("/admin/clustering")) return "K-Means Clustering";
  if (pathname.startsWith("/admin/feedback")) return "Feedback";
  if (pathname.startsWith("/admin/profile")) return "Profile";
  return "MBG";
}

function pageSubtitle(pathname) {
  if (pathname === "/admin" || pathname === "/admin/")
    return "Ringkasan operasional MBG";
  if (pathname.startsWith("/admin/menus/new"))
    return "Workspace perencanaan menu harian";
  if (pathname.startsWith("/admin/menus/"))
    return "Lihat & edit menu";
  if (pathname.startsWith("/admin/menus"))
    return "Modul transaksi utama · perencanaan menu harian dengan analisis AKG";
  if (pathname.startsWith("/admin/foods")) return "Master data makanan";
  if (pathname.startsWith("/admin/nutritions")) return "Master data nutrisi per 100g";
  if (pathname.startsWith("/admin/clustering"))
    return "Pengelompokan makanan untuk rekomendasi menu";
  if (pathname.startsWith("/admin/feedback")) return "Umpan balik dari sekolah";
  if (pathname.startsWith("/admin/profile")) return "Pengaturan akun Anda";
  return "";
}

function SidebarItem({ to, label, Icon, end, highlighted, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={({ isActive }) => {
        if (highlighted) {
          return [
            "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border",
            isActive
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200"
              : "bg-emerald-50/60 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
          ].join(" ");
        }
        return [
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors border",
          isActive
            ? "bg-emerald-50 text-emerald-700 border-emerald-100 font-medium"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent",
        ].join(" ");
      }}
    >
      <Icon size={highlighted ? 17 : 16} />
      <span className="flex-1">{label}</span>
      {highlighted && (
        <>
          <Sparkles size={12} className="opacity-80" />
          {badge && (
            <span className="text-[9px] font-bold tracking-widest bg-white/20 text-current px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col"
        data-testid="admin-sidebar"
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white grid place-items-center font-bold text-sm tracking-tight shadow-sm">
            MBG
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">MBG Admin</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              Menu Planning System
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-3 mb-2">
            Overview
          </div>
          <div className="space-y-1 mb-4">
            <SidebarItem {...NAV[0]} />
          </div>

          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-3 mb-2">
            Master Data
          </div>
          <div className="space-y-1 mb-4">
            {NAV[1].children.map((c) => (
              <SidebarItem key={c.to} {...c} />
            ))}
          </div>

          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-3 mb-2">
            Analytics
          </div>
          <div className="space-y-1 mb-4">
            <SidebarItem {...NAV[2]} />
          </div>

          <div className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold px-3 mb-2 flex items-center gap-1.5">
            <Sparkles size={11} />
            Core Transaction
          </div>
          <div className="space-y-1 mb-4">
            <SidebarItem {...NAV[3]} />
          </div>

          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-3 mb-2">
            Lainnya
          </div>
          <div className="space-y-1">
            <SidebarItem {...NAV[4]} />
            <SidebarItem {...NAV[5]} />
          </div>
        </nav>
      </aside>
      

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6"
          data-testid="admin-topbar"
        >
          <div>
            <div className="text-base font-semibold text-slate-900">
              {pageTitle(location.pathname)}
            </div>
            <div className="text-xs text-slate-500">
              {pageSubtitle(location.pathname)}
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

        <main className="flex-1 overflow-y-auto" data-testid="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
