import { useEffect, useState } from "react";
import {
  Apple,
  Activity,
  CalendarDays,
  MessageSquare,
  Network,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { mbgApi, unwrap, unwrapList } from "../../components/lib/mbg-api";
import { Card, CardHeader, StatCard, Badge, Button } from "../../components/admin/ui";

function formatDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      Promise.all([
        mbgApi.get("/api/dashboard").then(unwrap),
        mbgApi
          .get("/api/menus", { params: { limit: 5, sort_order: "desc" } })
          .then((r) => unwrapList(r).data)
          .catch(() => []),
      ])
        .then(([d, list]) => {
          setStats(d);
          setRecent(list);
        })
        .catch((e) => {
          const msg =
            e.response?.data?.message ||
            (e.code === "ERR_NETWORK"
              ? "Tidak dapat terhubung ke server MBG (cek REACT_APP_MBG_API_URL)."
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
  const cs = stats?.clustering_summary;

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-medium">Tidak dapat memuat data dashboard.</div>
            <div className="text-xs mt-0.5">{err}</div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Foods"
          value={loading ? "—" : totals?.total_foods ?? 0}
          hint="Data makanan tersimpan"
          Icon={Apple}
          accent="emerald"
        />
        <StatCard
          label="Total Nutritions"
          value={loading ? "—" : totals?.total_nutritions ?? 0}
          hint="Nutrisi per 100g"
          Icon={Activity}
          accent="blue"
        />
        <StatCard
          label="Total Menus"
          value={loading ? "—" : totals?.total_menus ?? 0}
          hint={
            ms
              ? `${ms.total_published} terbit · ${ms.total_draft} draft`
              : "Menu harian"
          }
          Icon={CalendarDays}
          accent="amber"
        />
        <StatCard
          label="Total Feedbacks"
          value={loading ? "—" : totals?.total_feedbacks ?? 0}
          hint={fb ? `${fb.new} baru menanti review` : "Dari sekolah"}
          Icon={MessageSquare}
          accent="rose"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Clustering summary */}
        <Card>
          <CardHeader
            title="Clustering Aktif"
            subtitle="Hasil K-Means terbaru"
            action={
              <Link to="/admin/clustering">
                <Button variant="ghost" size="sm">
                  Detail
                </Button>
              </Link>
            }
          />
          <div className="p-6">
            {cs?.has_active_clustering ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center">
                    <Network size={20} />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tabular-nums">
                      {cs.active_cluster_count}
                    </div>
                    <div className="text-xs text-slate-500">cluster aktif</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  <Clock size={12} /> Terakhir dijalankan:{" "}
                  <span className="text-slate-700 font-medium">
                    {formatDate(cs.latest_run_date)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-sm text-slate-500 mb-3">
                  Belum ada clustering aktif.
                </div>
                <Link to="/admin/clustering">
                  <Button size="sm">Jalankan K-Means</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Feedback split */}
        <Card>
          <CardHeader
            title="Status Feedback"
            subtitle="Distribusi feedback"
            action={
              <Link to="/admin/feedback">
                <Button variant="ghost" size="sm">
                  Kelola
                </Button>
              </Link>
            }
          />
          <div className="p-6 space-y-3">
            <FeedbackRow
              label="Baru"
              count={fb?.new ?? 0}
              tone="amber"
              Icon={AlertCircle}
            />
            <FeedbackRow
              label="Direview"
              count={fb?.reviewed ?? 0}
              tone="blue"
              Icon={Clock}
            />
            <FeedbackRow
              label="Selesai"
              count={fb?.resolved ?? 0}
              tone="emerald"
              Icon={CheckCircle2}
            />
          </div>
        </Card>

        {/* Menu split */}
        <Card>
          <CardHeader
            title="Status Menu"
            subtitle="Draft & terbit"
            action={
              <Link to="/admin/menus">
                <Button variant="ghost" size="sm">
                  Kelola
                </Button>
              </Link>
            }
          />
          <div className="p-6 space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <div className="text-3xl font-semibold text-emerald-700 tabular-nums">
                  {ms?.total_published ?? 0}
                </div>
                <div className="text-xs text-slate-500">Terbit</div>
              </div>
              <div className="text-slate-300 text-2xl pb-1">/</div>
              <div>
                <div className="text-3xl font-semibold text-slate-700 tabular-nums">
                  {ms?.total_draft ?? 0}
                </div>
                <div className="text-xs text-slate-500">Draft</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <TrendingUp size={12} className="text-emerald-600" />
              {totals?.total_menus ?? 0} menu total tersimpan
            </div>
          </div>
        </Card>
      </div>

      {/* Recent menus */}
      <Card>
        <CardHeader
          title="Menu Terbaru"
          subtitle="5 menu terakhir yang dibuat"
          action={
            <Link to="/admin/menus">
              <Button variant="secondary" size="sm">
                Lihat semua
              </Button>
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Tanggal</th>
                <th className="text-left px-6 py-3 font-medium">Nama Menu</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Kalori</th>
                <th className="text-left px-6 py-3 font-medium">AKG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Belum ada menu.
                  </td>
                </tr>
              ) : (
                recent.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-700">{formatDate(m.menu_date)}</td>
                    <td className="px-6 py-3 font-medium text-slate-900">{m.menu_name}</td>
                    <td className="px-6 py-3">
                      <Badge tone={m.status === "published" ? "emerald" : "slate"}>
                        {m.status === "published" ? "Terbit" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {Math.round(m.total_calories || 0)} kkal
                    </td>
                    <td className="px-6 py-3">
                      <Badge tone={m.meets_akg ? "emerald" : "amber"}>
                        {m.meets_akg ? "Sesuai" : "Belum"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function FeedbackRow({ label, count, tone, Icon }) {
  const colorMap = {
    amber:   "text-amber-600 bg-amber-50",
    blue:    "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className={`h-8 w-8 rounded-lg grid place-items-center ${colorMap[tone]}`}>
          <Icon size={14} />
        </div>
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <span className="text-lg font-semibold tabular-nums">{count}</span>
    </div>
  );
}
