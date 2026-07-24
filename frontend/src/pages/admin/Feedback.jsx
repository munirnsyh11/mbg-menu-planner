import { useCallback, useEffect, useState } from "react";
import { Star, AlertCircle, Loader2, Search, Inbox } from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrapList } from "@/lib/mbg-api";
import { Card, CardHeader, Button, Select, Input, Badge } from "@/components/admin/ui";
import { FEEDBACK_STATUSES, RATING_LABELS } from "@/constants/mbg";

const STATUS_TONE  = { new: "amber", reviewed: "blue", resolved: "emerald" };
const STATUS_LABEL = { new: "Baru", reviewed: "Direview", resolved: "Selesai" };

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function Stars({ value, max = 4 }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={`star-${i}-${i < value ? "filled" : "empty"}`}
          size={12}
          className={i < value ? "fill-amber-400 text-amber-400" : "text-slate-300"}
        />
      ))}
      <span className="text-[11px] text-slate-500 ml-1.5">
        {RATING_LABELS[value] || value}
      </span>
    </div>
  );
}

export default function Feedback() {
  const [list, setList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await mbgApi.get("/api/feedback", {
        params: {
          status: statusFilter || undefined,
          search: search || undefined,
          page,
          limit: 10,
        },
      });
      const u = unwrapList(res);
      setList(u.data);
      setPagination(u.pagination);
    } catch (e) {
      setErr(e.response?.data?.message || "Gagal memuat feedback.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (fb, next) => {
    try {
      await mbgApi.patch(`/api/feedback/${fb._id}/status`, { status: next });
      toast.success(`Feedback diset ${STATUS_LABEL[next]}`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal update status");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-testid="feedback-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      <Card>
        <CardHeader
          title="Feedback"
          subtitle={pagination ? `${pagination.total || list.length} feedback` : "Umpan balik dari sekolah"}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9 w-56"
                  data-testid="feedback-search"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-40"
                data-testid="feedback-status-filter"
              >
                <option value="">Semua status</option>
                {FEEDBACK_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">User</th>
                <th className="text-left px-6 py-3 font-medium">Menu</th>
                <th className="text-left px-6 py-3 font-medium">Rating</th>
                <th className="text-left px-6 py-3 font-medium">Komentar</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Tanggal</th>
                <th className="text-right px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    <Loader2 size={18} className="animate-spin inline" /> Memuat...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Inbox size={28} className="mx-auto text-slate-300 mb-2" />
                    <div className="text-sm font-medium text-slate-700">Belum ada feedback</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Feedback dari sekolah akan muncul di sini.
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((fb) => (
                  <tr key={fb._id} className="hover:bg-slate-50" data-testid={`feedback-row-${fb._id}`}>
                    <td className="px-6 py-3">
                      <div className="font-medium text-slate-900">
                        {fb.user_id?.name || "—"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {fb.user_id?.school_name || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      {fb.menu_id?.menu_name || "—"}
                    </td>
                    <td className="px-6 py-3">
                      <Stars value={fb.rating || 0} />
                    </td>
                    <td className="px-6 py-3 text-slate-600 max-w-md truncate">
                      {fb.comment || <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="px-6 py-3">
                      <Badge tone={STATUS_TONE[fb.status]}>
                        {STATUS_LABEL[fb.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-slate-700 text-xs">
                      {fmtDate(fb.created_at || fb.createdAt)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {fb.status === "new" && (
                        <Button size="sm" variant="secondary" onClick={() => updateStatus(fb, "reviewed")}>
                          Review
                        </Button>
                      )}
                      {fb.status === "reviewed" && (
                        <Button size="sm" onClick={() => updateStatus(fb, "resolved")}>
                          Selesaikan
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 10 && (
          <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Halaman {pagination.page} dari {Math.ceil(pagination.total / pagination.limit)}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ‹ Prev
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ›
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
