import { useEffect, useState } from "react";
import {
  Apple,
  CalendarDays,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { mbgApi, unwrap } from "@/lib/mbg-api";
import { Card, CardHeader, StatCard, Button, Badge } from "@/components/admin/ui";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      mbgApi
        .get("/api/dashboard")
        .then(unwrap)
        .then((d) => setStats(d))
        .catch((e) => {
          const msg =
            e.response?.data?.message ||
            (e.code === "ERR_NETWORK"
              ? "Tidak dapat terhubung ke server MBG."
              : e.message);
          setErr(msg);
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const totals = stats?.totals;
  const fb = stats?.feedback_summary;
  const ms = stats?.menu_summary;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="dashboard-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-medium">Tidak dapat memuat data dashboard.</div>
            <div className="text-xs mt-0.5">{err}</div>
          </div>
        </div>
      )}

      {/* CTA banner — push to Menu Planner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white p-6 flex items-center justify-between shadow-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90 mb-1">
            <Sparkles size={12} />
            Core Module
          </div>
          <h2 className="text-2xl font-bold mb-1">Menu Planner</h2>
          <p className="text-sm text-emerald-50 max-w-md">
            Modul transaksi utama. Mulai perencanaan menu harian dengan
            analisis AKG dan rekomendasi dari clustering.
          </p>
        </div>
        <Link to="/admin/menus">
          <button
            className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl px-5 py-3 text-sm flex items-center gap-2 shadow-sm transition"
            data-testid="dashboard-cta-menus"
          >
            Buka Menu Planner <ArrowRight size={14} />
          </button>
        </Link>
      </div>

      {/* Summary cards — small, dashboard is just overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Foods"
          value={loading ? "—" : totals?.total_foods ?? 0}
          hint="Master data makanan"
          Icon={Apple}
          accent="emerald"
        />
        <StatCard
          label="Total Menus"
          value={loading ? "—" : totals?.total_menus ?? 0}
          hint={ms ? `${ms.total_published} terbit · ${ms.total_draft} draft` : "Menu harian"}
          Icon={CalendarDays}
          accent="emerald"
        />
        <StatCard
          label="Published"
          value={loading ? "—" : ms?.total_published ?? 0}
          hint="Menu yang sudah terbit"
          Icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Total Feedback"
          value={loading ? "—" : totals?.total_feedbacks ?? 0}
          hint={fb ? `${fb.new} baru menanti` : "Dari sekolah"}
          Icon={MessageSquare}
          accent="slate"
        />
      </div>

      {/* Slim status row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Status Menu" subtitle="Distribusi draft & terbit" />
          <div className="p-6">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700 tabular-nums">
                  {ms?.total_published ?? 0}
                </div>
                <div className="text-xs text-slate-500 mt-1">Terbit</div>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-500 tabular-nums">
                  {ms?.total_draft ?? 0}
                </div>
                <div className="text-xs text-slate-500 mt-1">Draft</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Status Feedback" subtitle="Belum/dalam/selesai diproses" />
          <div className="p-6">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <Badge tone="amber">Baru</Badge>
                <div className="text-2xl font-bold mt-2 tabular-nums">
                  {fb?.new ?? 0}
                </div>
              </div>
              <div className="text-center">
                <Badge tone="blue">Direview</Badge>
                <div className="text-2xl font-bold mt-2 tabular-nums">
                  {fb?.reviewed ?? 0}
                </div>
              </div>
              <div className="text-center">
                <Badge tone="emerald">Selesai</Badge>
                <div className="text-2xl font-bold mt-2 tabular-nums">
                  {fb?.resolved ?? 0}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
