import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, Button } from "@/components/admin/ui";
import { Mail, Shield, LogOut, User } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6" data-testid="profile-page">
      <Card>
        <CardHeader title="Profil Akun" subtitle="Informasi akun & sesi Anda" />
        <div className="p-6 flex items-start gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white grid place-items-center text-2xl font-bold shadow">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-xl font-semibold text-slate-900">
              {user?.name || "—"}
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <Mail size={14} /> {user?.email || "—"}
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <Shield size={14} />
              <span className="capitalize">{user?.role || "—"}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Detail" />
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Row label="Nama" value={user?.name} />
          <Row label="Email" value={user?.email} />
          <Row label="Role" value={user?.role} />
          <Row label="School Name" value={user?.school_name || "—"} />
        </div>
      </Card>

      <Card>
        <CardHeader title="Sesi" subtitle="Kelola sesi Anda" />
        <div className="p-6">
          <Button variant="danger" onClick={logout} data-testid="profile-logout">
            <LogOut size={14} /> Logout dari akun
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start gap-2">
      <User size={14} className="text-slate-400 mt-0.5" />
      <div>
        <div className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">
          {label}
        </div>
        <div className="text-sm text-slate-900 mt-0.5">{value || "—"}</div>
      </div>
    </div>
  );
}
