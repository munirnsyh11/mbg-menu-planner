import { useCallback, useEffect, useState, useTransition } from "react";
import { Play, Network, Layers, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrap } from "@/lib/mbg-api";
import { Card, CardHeader, Button, Input, Label, Badge } from "@/components/admin/ui";

export default function Clustering() {
  const [k, setK] = useState(3);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [running, startRun] = useTransition();
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const d = await mbgApi.get("/api/clustering/active").then(unwrap);
      setActive(d);
      setK(d?.k_value || 3);
    } catch (e) {
      if (e.response?.status === 404) setActive(null);
      else setErr(e.response?.data?.message || "Gagal memuat clustering.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const handleRun = () => {
    if (k < 2 || k > 10) {
      toast.error("Nilai K harus 2 - 10");
      return;
    }
    startRun(async () => {
      try {
        const res = await mbgApi.post("/api/clustering/run", { k });
        toast.success(res.data?.message || "K-Means selesai");
        await load();
      } catch (e) {
        toast.error(e.response?.data?.message || "Gagal menjalankan K-Means");
      }
    });
  };

  return (
    <div className="space-y-6" data-testid="clustering-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      {/* Run panel */}
      <Card>
        <CardHeader
          title="Jalankan K-Means Clustering"
          subtitle="Kelompokkan makanan berdasarkan profil nutrisi"
        />
        <div className="p-6 flex flex-wrap items-end gap-4">
          <div>
            <Label required>Jumlah Cluster (K)</Label>
            <Input
              type="number"
              min={2}
              max={10}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="w-32"
              data-testid="k-value-input"
            />
            <p className="text-[11px] text-slate-500 mt-1.5">Range valid: 2 - 10</p>
          </div>
          <Button onClick={handleRun} disabled={running} data-testid="run-kmeans-btn">
            <Play size={14} />
            {running ? "Memproses..." : "Jalankan K-Means"}
          </Button>
          {active && (
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <Badge tone="emerald">Aktif</Badge>
              <span>Run ID: {active.run_id?.slice(0, 8)}...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Active clusters */}
      <Card>
        <CardHeader
          title="Cluster Aktif"
          subtitle={
            active
              ? `${active.clusters?.length || 0} cluster · K=${active.k_value}`
              : "Belum ada clustering aktif"
          }
        />
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400">Memuat...</div>
          ) : !active ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-100 grid place-items-center mb-3">
                <Network size={22} className="text-slate-400" />
              </div>
              <div className="text-sm font-medium text-slate-700">Belum ada clustering</div>
              <div className="text-xs text-slate-500 mt-1">
                Jalankan K-Means untuk membuat cluster pertama Anda.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.clusters?.map((c) => (
                <ClusterCard key={c._id} cluster={c} />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function ClusterCard({ cluster }) {
  return (
    <div className="rounded-xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
            Cluster {cluster.cluster_label}
          </div>
          <div className="text-base font-semibold text-slate-900 mt-0.5">
            {cluster.cluster_name}
          </div>
        </div>
        <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center">
          <Layers size={16} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <CentroidRow label="Kalori" value={`${Math.round(cluster.centroid_calories || 0)}`} />
        <CentroidRow label="Protein" value={`${(cluster.centroid_protein || 0).toFixed(1)} g`} />
        <CentroidRow label="Lemak" value={`${(cluster.centroid_fat || 0).toFixed(1)} g`} />
        <CentroidRow label="Karbo" value={`${(cluster.centroid_carbo || 0).toFixed(1)} g`} />
      </div>

      <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 text-xs">
        <Zap size={12} className="text-emerald-600" />
        <span className="text-slate-700 font-medium">{cluster.food_count}</span>
        <span className="text-slate-500">makanan dalam cluster ini</span>
      </div>

      {cluster.foods?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cluster.foods.slice(0, 6).map((f) => (
            <Badge key={f._id} tone="slate">
              {f.name}
            </Badge>
          ))}
          {cluster.foods.length > 6 && (
            <span className="text-[11px] text-slate-500 px-1.5 py-0.5">
              +{cluster.foods.length - 6} lainnya
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function CentroidRow({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded-md px-2.5 py-1.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}
