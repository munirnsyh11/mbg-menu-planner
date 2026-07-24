import { useCallback, useEffect, useState } from "react";
import { Play, Network, Layers, AlertCircle, Sparkles, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { mbgApi, unwrap } from "@/lib/mbg-api";
import { Card, CardHeader, Button, Input, Label, Badge } from "@/components/admin/ui";

export default function Clustering() {
  const [k, setK] = useState(3);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  // L1 fix: useTransition doesn't support async — use plain useState instead
  const [running, setRunning] = useState(false);
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

  const handleRun = async () => {
    if (k < 2 || k > 10) {
      toast.error("Nilai K harus 2 - 10");
      return;
    }
    setRunning(true);
    try {
      const res = await mbgApi.post("/api/clustering/run", { k });
      toast.success(res.data?.message || "K-Means selesai");
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menjalankan K-Means");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-testid="clustering-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      {/* 3-step workflow ribbon */}
      <Card>
        <CardHeader
          title="Alur Clustering"
          subtitle="Modul pendukung untuk Menu Planner — hasil cluster digunakan sebagai rekomendasi makanan"
        />
        <div className="p-6 flex items-center justify-between gap-3">
          <StepBox n={1} title="Generate Cluster" desc="Tentukan K & jalankan K-Means" active />
          <ChevronRight size={18} className="text-slate-300 shrink-0" />
          <StepBox n={2} title="Tampilkan Hasil" desc="Lihat cluster + centroid" active={!!active} />
          <ChevronRight size={18} className="text-slate-300 shrink-0" />
          <StepBox n={3} title="Rekomendasi" desc="Gunakan di Menu Planner" />
        </div>
      </Card>

      {/* Step 1: Run */}
      <Card>
        <CardHeader title="Step 1 · Jalankan K-Means" subtitle="Kelompokkan makanan berdasarkan profil nutrisi" />
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
            <p className="text-[11px] text-slate-500 mt-1.5">Range: 2 - 10</p>
          </div>
          <Button onClick={handleRun} disabled={running} data-testid="run-kmeans-btn">
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? "Memproses..." : "Jalankan"}
          </Button>
          {active && (
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <Badge tone="emerald">Aktif</Badge>
              <span>K = {active.k_value} · Run {active.run_id?.slice(0, 8)}...</span>
            </div>
          )}
        </div>
      </Card>

      {/* Step 2: Display */}
      <Card>
        <CardHeader
          title="Step 2 · Hasil Cluster"
          subtitle={active ? `${active.clusters?.length || 0} cluster aktif` : "Belum ada clustering aktif"}
        />
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Loader2 size={18} className="animate-spin inline" /> Memuat...
            </div>
          ) : !active ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-100 grid place-items-center mb-3">
                <Network size={22} className="text-slate-400" />
              </div>
              <div className="text-sm font-medium text-slate-700">Belum ada clustering</div>
              <div className="text-xs text-slate-500 mt-1">
                Jalankan K-Means di atas untuk membuat cluster.
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

      {/* Step 3: CTA to Menu Planner */}
      <Card className={active ? "border-emerald-200 bg-emerald-50/30" : ""}>
        <CardHeader
          title="Step 3 · Gunakan Rekomendasi"
          subtitle="Cluster yang aktif otomatis muncul di Menu Planner sebagai rekomendasi"
        />
        <div className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">
                {active ? "Siap dipakai di Menu Planner" : "Generate cluster terlebih dahulu"}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Cluster aktif akan tampil sebagai filter & saran di workspace menu.
              </div>
            </div>
          </div>
          <Link to="/admin/menus/new">
            <Button disabled={!active}>
              Buka Menu Planner <ChevronRight size={14} />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function StepBox({ n, title, desc, active }) {
  return (
    <div className={["flex-1 rounded-xl border p-4 transition", active ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50"].join(" ")}>
      <div className={["h-7 w-7 rounded-full grid place-items-center text-xs font-bold mb-2", active ? "bg-emerald-600 text-white" : "bg-slate-300 text-white"].join(" ")}>
        {n}
      </div>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{desc}</div>
    </div>
  );
}

function ClusterCard({ cluster }) {
  const [expanded, setExpanded] = useState(false);
  const foods = cluster.foods || [];

  return (
    <div className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:shadow-sm transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            Cluster {cluster.cluster_label}
          </div>
          <div className="text-sm font-semibold text-slate-900 mt-0.5">
            {cluster.cluster_name}
          </div>
        </div>
        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center">
          <Layers size={14} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[11px] mb-3">
        <Row label="Kal" value={`${Math.round(cluster.centroid_calories || 0)}`} />
        <Row label="Pro" value={`${(cluster.centroid_protein || 0).toFixed(1)}g`} />
        <Row label="Lmk" value={`${(cluster.centroid_fat || 0).toFixed(1)}g`} />
        <Row label="Krb" value={`${(cluster.centroid_carbo || 0).toFixed(1)}g`} />
      </div>

      {/* Food member list — M1 fix */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-between w-full text-[11px] text-slate-500 hover:text-slate-700"
          data-testid={`expand-cluster-${cluster.cluster_label}`}
        >
          <span>{foods.length > 0 ? `${foods.length} makanan` : `${cluster.food_count || 0} makanan`}</span>
          {foods.length > 0 && (
            <ChevronDown
              size={13}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {expanded && foods.length > 0 && (
          <ul className="mt-2 space-y-1" data-testid={`cluster-foods-${cluster.cluster_label}`}>
            {foods.map((f) => (
              <li
                key={f._id}
                className="flex items-center gap-2 text-[11px] text-slate-700 py-0.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">{f.name}</span>
                {f.category && (
                  <Badge tone="slate" className="ml-auto shrink-0 text-[9px]">
                    {f.category}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between bg-slate-50 rounded px-2 py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}
