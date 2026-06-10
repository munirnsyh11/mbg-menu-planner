import { useCallback, useEffect, useState } from "react";
import { Star, AlertCircle, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrapList } from "@/lib/mbg-api";
import { Card, CardHeader, Button, Select, Badge, StatCard } from "@/components/admin/ui";
import { FEEDBACK_STATUSES, RATING_LABELS } from "@/constants/mbg";

const STATUS_TONE = {
  new: "amber",
  reviewed: "blue",
  resolved: "emerald",
};

const STATUS_LABEL = {
  new: "Baru",
  reviewed: "Direview",
  resolved: "Selesai",
};

function StarRow({ value, max = 4 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < value ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }
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
  const [summary, setSummary] = useState({ new: 0, reviewed: 0, resolved: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await mbgApi.get("/api/feedback", {
        params: { status: statusFilter || undefined, limit: 100 },
      });
      const u = unwrapList(res);
      setList(u.data);
      setSummary(u.summary || { new: 0, reviewed: 0, resolved: 0 });
    } catch (e) {
      setErr(e.response?.data?.message || "Gagal memuat feedback.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (fb, nextStatus) => {
    try {
      await mbgApi.patch(`/api/feedback/${fb._id}/status`, { status: nextStatus });
      toast.success(`Feedback ${STATUS_LABEL[nextStatus]}`);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal memperbarui status");
    }
  };

  return (
    <div className="space-y-6" data-testid="feedback-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Baru"
          value={summary.new}
          hint="Belum direview"
          Icon={AlertCircle}
          accent="amber"
        />
        <StatCard
          label="Direview"
          value={summary.reviewed}
          hint="Sedang diproses"
          Icon={Clock}
          accent="blue"
        />
        <StatCard
          label="Selesai"
          value={summary.resolved}
          hint="Sudah ditindaklanjuti"
          Icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      <Card>
        <CardHeader
          title="Kelola Feedback"
          subtitle={`${list.length} feedback dari sekolah`}
          action={
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-44"
              data-testid="feedback-status-filter"
            >
              <option value="">Semua status</option>
              {FEEDBACK_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          }
        />

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400">Memuat...</div>
          ) : list.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-100 grid place-items-center mb-3">
                <MessageSquare size={22} className="text-slate-400" />
              </div>
              <div className="text-sm font-medium text-slate-700">
                Tidak ada feedback
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Feedback dari sekolah akan muncul di sini.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((fb) => (
                <div
                  key={fb._id}
                  className="rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors"
                  data-testid={`feedback-card-${fb._id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {fb.user_id?.name || "Pengguna"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {fb.user_id?.school_name || "—"}
                      </div>
                    </div>
                    <Badge tone={STATUS_TONE[fb.status]}>{STATUS_LABEL[fb.status]}</Badge>
                  </div>

                  <div className="mb-3">
                    <div className="text-[11px] text-slate-500 mb-0.5">Menu</div>
                    <div className="text-sm font-medium text-slate-700">
                      {fb.menu_id?.menu_name || "—"}
                    </div>
                  </div>

                  <div className="mb-3">
                    <StarRow value={fb.rating || 0} />
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-3 mb-4">
                    {fb.comment || <span className="text-slate-400 italic">Tidak ada komentar.</span>}
                  </p>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    {fb.status === "new" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateStatus(fb, "reviewed")}
                        data-testid={`review-feedback-${fb._id}`}
                      >
                        <Clock size={12} /> Tandai Direview
                      </Button>
                    )}
                    {fb.status === "reviewed" && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fb, "resolved")}
                        data-testid={`resolve-feedback-${fb._id}`}
                      >
                        <CheckCircle2 size={12} /> Tandai Selesai
                      </Button>
                    )}
                    {fb.status === "resolved" && (
                      <span className="text-[11px] text-slate-500 italic">
                        Feedback sudah ditindaklanjuti.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
