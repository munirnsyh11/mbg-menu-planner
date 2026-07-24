import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Search,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Apple,
  Activity,
  Loader2,
  Layers,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrapList, unwrap } from "@/lib/mbg-api";
import {
  Card,
  CardHeader,
  Button,
  Input,
  Select,
  Label,
  Badge,
} from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";
import { FOOD_CATEGORIES } from "@/constants/mbg";

// AKG standar porsi makan siang MBG sesuai BRD BAB 10.4
// Harus konsisten dengan AKG_STANDARDS di backend utils/constants.js
// calories: range 600-800 kkal, protein: min 15g, fat: max 25g, carbo: min 60g
const AKG_REF = {
  SD:  { calories: 700, protein: 20, fat: 20, carbohydrate: 90, fiber: 5 },
  SMP: { calories: 750, protein: 22, fat: 22, carbohydrate: 100, fiber: 6 },
  SMA: { calories: 800, protein: 25, fat: 25, carbohydrate: 110, fiber: 7 },
};

// AKG min/max constraints per BRD BAB 10.4 (same for all targets)
const AKG_CONSTRAINTS = {
  calories:     { min: 600,  max: 800 },
  protein:      { min: 15,   max: null },
  fat:          { min: null, max: 25 },
  carbohydrate: { min: 60,   max: null },
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function MenuWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id && id !== "new";

  // Form state
  const [date, setDate] = useState(todayIso());
  const [name, setName] = useState("");
  const [target, setTarget] = useState("SD");
  const [items, setItems] = useState([]); // [{food_id, portion_gram}]
  const [status, setStatus] = useState("draft");

  // Data
  const [foods, setFoods] = useState([]);
  const [nutritionMap, setNutritionMap] = useState({});
  const [clusters, setClusters] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCluster, setFilterCluster] = useState("");
  const [confirmPublish, setConfirmPublish] = useState(false);

  // Load initial data
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      const calls = [
        mbgApi.get("/api/foods", { params: { limit: 100 } }),
        mbgApi.get("/api/nutritions", { params: { limit: 100 } }),
        mbgApi
          .get("/api/clustering/active")
          .then(unwrap)
          .catch(() => null),
      ];
      if (isEdit) calls.push(mbgApi.get(`/api/menus/${id}`).then(unwrap));

      Promise.all(calls)
        .then((res) => {
          const [fRes, nRes, cluster, menu] = res;
          setFoods(unwrapList(fRes).data);
          const map = {};
          unwrapList(nRes).data.forEach((row) => {
            const fid = row.food_id?._id || row.food_id;
            if (fid) map[fid] = row;
          });
          setNutritionMap(map);
          setClusters(cluster?.clusters || []);
          if (menu) {
            setName(menu.menu_name || "");
            setDate(menu.menu_date?.slice(0, 10) || todayIso());
            setTarget(menu.target_demographic || "SD");
            setStatus(menu.status || "draft");
            setItems(
              (menu.items || []).map((it) => ({
                food_id: it.food_id?._id || it.food_id,
                portion_gram: it.portion_gram,
              }))
            );
          }
        })
        .catch((e) => {
          setErr(e.response?.data?.message || "Gagal memuat data workspace.");
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(t);
  }, [id, isEdit]);

  // Computed: nutrition totals
  const totals = useMemo(() => {
    const t = { calories: 0, protein: 0, fat: 0, carbohydrate: 0, fiber: 0 };
    for (const it of items) {
      const n = nutritionMap[it.food_id];
      if (!n) continue;
      const g = Number(it.portion_gram || 0) / 100;
      t.calories     += (n.calories     || 0) * g;
      t.protein      += (n.protein      || 0) * g;
      t.fat          += (n.fat          || 0) * g;
      t.carbohydrate += (n.carbohydrate || 0) * g;
      t.fiber        += (n.fiber        || 0) * g;
    }
    return t;
  }, [items, nutritionMap]);

  const akg = AKG_REF[target];
  const akgPct = {
    calories:     pct(totals.calories,     akg.calories),
    protein:      pct(totals.protein,      akg.protein),
    fat:          pct(totals.fat,          akg.fat),
    carbohydrate: pct(totals.carbohydrate, akg.carbohydrate),
    fiber:        pct(totals.fiber,        akg.fiber),
  };
  // meetsAkg: consistent with backend checkMeetsAKG (BRD BAB 10.4)
  const meetsAkg =
    totals.calories     >= AKG_CONSTRAINTS.calories.min &&
    totals.calories     <= AKG_CONSTRAINTS.calories.max &&
    totals.protein      >= AKG_CONSTRAINTS.protein.min &&
    totals.fat          <= AKG_CONSTRAINTS.fat.max &&
    totals.carbohydrate >= AKG_CONSTRAINTS.carbohydrate.min;

  // Filtered available foods
  const filteredFoods = useMemo(() => {
    const q = search.trim().toLowerCase();
    return foods.filter((f) => {
      if (q && !f.name.toLowerCase().includes(q)) return false;
      if (filterCategory && f.category !== filterCategory) return false;
      if (filterCluster !== "" && String(f.cluster_label) !== filterCluster) return false;
      return true;
    });
  }, [foods, search, filterCategory, filterCluster]);

  const addFood = useCallback((foodId) => {
    setItems((arr) => {
      if (arr.find((it) => it.food_id === foodId)) {
        toast.info("Makanan sudah ditambahkan");
        return arr;
      }
      if (!nutritionMap[foodId]) {
        toast.error("Makanan ini belum memiliki data nutrisi.");
        return arr;
      }
      return [...arr, { food_id: foodId, portion_gram: 100 }];
    });
  }, [nutritionMap]);

  const updatePortion = (foodId, gram) => {
    setItems((arr) =>
      arr.map((it) =>
        it.food_id === foodId ? { ...it, portion_gram: Number(gram) || 0 } : it
      )
    );
  };

  const removeFood = (foodId) => {
    setItems((arr) => arr.filter((it) => it.food_id !== foodId));
  };

  // Recommendations from clustering: suggest underrepresented categories/clusters
  const recommendations = useMemo(() => {
    if (!clusters.length) return [];
    const selectedClusters = new Set(
      items
        .map((it) => foods.find((f) => f._id === it.food_id))
        .filter(Boolean)
        .map((f) => f.cluster_label)
    );
    const recs = [];
    if (akgPct.protein < 80) {
      // Find protein-rich foods not in items
      const proteinFoods = foods
        .filter((f) => f.category === "protein")
        .filter((f) => !items.find((it) => it.food_id === f._id))
        .filter((f) => nutritionMap[f._id])
        .sort((a, b) =>
          (nutritionMap[b._id]?.protein || 0) - (nutritionMap[a._id]?.protein || 0)
        )
        .slice(0, 3);
      proteinFoods.forEach((f) =>
        recs.push({
          food: f,
          reason: `Tambahkan protein (${nutritionMap[f._id]?.protein || 0}g per 100g)`,
          icon: "protein",
        })
      );
    }
    if (akgPct.fiber < 70) {
      const fiberFoods = foods
        .filter((f) => ["sayuran", "buah"].includes(f.category))
        .filter((f) => !items.find((it) => it.food_id === f._id))
        .filter((f) => nutritionMap[f._id])
        .sort((a, b) =>
          (nutritionMap[b._id]?.fiber || 0) - (nutritionMap[a._id]?.fiber || 0)
        )
        .slice(0, 2);
      fiberFoods.forEach((f) =>
        recs.push({
          food: f,
          reason: `Tambahkan serat (${nutritionMap[f._id]?.fiber || 0}g per 100g)`,
          icon: "fiber",
        })
      );
    }
    // Fall back: explore other clusters
    if (recs.length < 2 && clusters.length) {
      clusters
        .filter((c) => !selectedClusters.has(c.cluster_label))
        .slice(0, 2)
        .forEach((c) => {
          const sample = (c.foods || []).find(
            (f) => !items.find((it) => it.food_id === f._id) && nutritionMap[f._id]
          );
          if (sample)
            recs.push({
              food: sample,
              reason: `Variasi dari cluster "${c.cluster_name}"`,
              icon: "cluster",
            });
        });
    }
    return recs.slice(0, 4);
  }, [clusters, items, foods, nutritionMap, akgPct]);

  // Save handler
  const save = async (nextStatus) => {
    if (!name.trim()) {
      toast.error("Nama menu wajib diisi");
      return;
    }
    if (items.length === 0) {
      toast.error("Tambahkan minimal 1 makanan");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        menu_date: date,
        menu_name: name,
        status: nextStatus,
        items: items.map((it) => ({
          food_id: it.food_id,
          portion_gram: Number(it.portion_gram),
        })),
      };
      if (isEdit) {
        await mbgApi.put(`/api/menus/${id}`, payload);
        toast.success(
          nextStatus === "published" ? "Menu dipublikasikan" : "Menu disimpan"
        );
      } else {
        const res = await mbgApi.post("/api/menus", payload);
        toast.success(
          nextStatus === "published"
            ? "Menu dibuat & dipublikasikan"
            : "Menu disimpan sebagai draft"
        );
        navigate(`/admin/menus/${res.data?.data?._id || ""}`, { replace: true });
        return;
      }
      setStatus(nextStatus);
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menyimpan menu");
    } finally {
      setSaving(false);
      setConfirmPublish(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500" data-testid="menus-loading">
        <Loader2 size={20} className="animate-spin mx-auto mb-2" />
        Memuat workspace...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full" data-testid="menu-workspace">
      {/* Workspace header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin/menus" className="text-slate-400 hover:text-slate-700">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-slate-900 truncate">
                  {isEdit ? name || "Edit Menu" : "Workspace Menu Baru"}
                </h1>
                <Badge tone={status === "published" ? "emerald" : "slate"}>
                  {status === "published" ? "Terbit" : "Draft"}
                </Badge>
                <Badge tone={meetsAkg ? "emerald" : "amber"}>
                  {meetsAkg ? (
                    <>
                      <CheckCircle2 size={10} /> Sesuai AKG
                    </>
                  ) : (
                    <>
                      <AlertCircle size={10} /> Belum sesuai
                    </>
                  )}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Step 1 → Info · Step 2 → Pilih Makanan · Step 3 → Kalkulasi · Step 4 → AKG · Step 5 → Review · Step 6 → Publish
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" onClick={() => save("draft")} disabled={saving} data-testid="save-draft-btn">
              <Save size={14} /> Simpan Draft
            </Button>
            <Button onClick={() => setConfirmPublish(true)} disabled={saving} data-testid="publish-menu-btn">
              <Send size={14} /> {saving ? "Memproses..." : "Publish Menu"}
            </Button>
          </div>
        </div>
      </div>

      {err && (
        <div className="max-w-7xl mx-auto px-6 mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      {/* Main workspace grid */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — selection (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Menu Info */}
          <Section step={1} title="Informasi Menu" subtitle="Identitas dasar menu yang akan disusun">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Label required>Nama Menu</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="cth. Menu Bergizi Senin"
                  data-testid="menu-name-input"
                />
              </div>
              <div>
                <Label required>Tanggal</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  data-testid="menu-date-input"
                />
              </div>
              <div className="sm:col-span-3">
                <Label required>Target Demografi</Label>
                <div className="flex gap-2">
                  {Object.keys(AKG_REF).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTarget(t)}
                      className={[
                        "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition",
                        target === t
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400",
                      ].join(" ")}
                      data-testid={`target-${t}`}
                    >
                      {t} · {AKG_REF[t].calories} kkal
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Step 2: Food Selection */}
          <Section
            step={2}
            title="Pilih Makanan"
            subtitle="Cari & tambahkan makanan dari master data"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari makanan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="food-search"
                />
              </div>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-40"
              >
                <option value="">Semua kategori</option>
                {FOOD_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
              {clusters.length > 0 && (
                <Select
                  value={filterCluster}
                  onChange={(e) => setFilterCluster(e.target.value)}
                  className="w-44"
                >
                  <option value="">Semua cluster</option>
                  {clusters.map((c) => (
                    <option key={c._id} value={c.cluster_label}>
                      Cluster {c.cluster_label} · {c.cluster_name}
                    </option>
                  ))}
                </Select>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto -mx-2 px-2">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  Tidak ada makanan cocok.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredFoods.map((f) => {
                    const n = nutritionMap[f._id];
                    const selected = !!items.find((it) => it.food_id === f._id);
                    return (
                      <button
                        key={f._id}
                        type="button"
                        onClick={() => addFood(f._id)}
                        disabled={selected}
                        className={[
                          "text-left rounded-lg border p-3 transition",
                          selected
                            ? "bg-emerald-50 border-emerald-200 cursor-not-allowed opacity-70"
                            : "bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm",
                        ].join(" ")}
                        data-testid={`food-add-${f._id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {f.name}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 capitalize">
                              {f.category}{" "}
                              {f.cluster_label != null && `· Cluster ${f.cluster_label}`}
                            </div>
                            {n && (
                              <div className="text-[11px] text-slate-500 mt-1.5">
                                {n.calories} kkal · P{n.protein}g · L{n.fat}g · K{n.carbohydrate}g
                              </div>
                            )}
                            {!n && (
                              <div className="text-[11px] text-amber-600 mt-1.5">
                                ⚠ Belum ada nutrisi
                              </div>
                            )}
                          </div>
                          {selected ? (
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          ) : (
                            <Plus size={16} className="text-slate-400 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>

          {/* Step 3: Selected Foods with portions */}
          <Section
            step={3}
            title="Komposisi Menu"
            subtitle={
              items.length === 0
                ? "Belum ada makanan dipilih"
                : `${items.length} makanan · porsi otomatis dikalkulasi`
            }
          >
            {items.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                <Apple size={28} className="mx-auto text-slate-300 mb-2" />
                <div className="text-sm text-slate-500">
                  Pilih makanan dari daftar di atas untuk mulai menyusun menu.
                </div>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium">Makanan</th>
                      <th className="text-right px-4 py-2 font-medium w-28">Porsi (g)</th>
                      <th className="text-right px-4 py-2 font-medium w-24">Kalori</th>
                      <th className="text-right px-4 py-2 font-medium w-24">Protein</th>
                      <th className="text-right px-4 py-2 font-medium w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it) => {
                      const f = foods.find((x) => x._id === it.food_id);
                      const n = nutritionMap[it.food_id];
                      const g = Number(it.portion_gram || 0) / 100;
                      return (
                        <tr key={it.food_id} className="hover:bg-slate-50">
                          <td className="px-4 py-2.5">
                            <div className="font-medium text-slate-900">{f?.name || "—"}</div>
                            <div className="text-[11px] text-slate-500 capitalize">{f?.category}</div>
                          </td>
                          <td className="px-4 py-2.5">
                            <Input
                              type="number"
                              min={1}
                              value={it.portion_gram}
                              onChange={(e) => updatePortion(it.food_id, e.target.value)}
                              className="w-24 text-right tabular-nums"
                              data-testid={`portion-${it.food_id}`}
                            />
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                            {Math.round((n?.calories || 0) * g)} kkal
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                            {((n?.protein || 0) * g).toFixed(1)} g
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => removeFood(it.food_id)}
                              className="text-slate-400 hover:text-rose-600"
                              data-testid={`remove-${it.food_id}`}
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Recommendation panel */}
          {recommendations.length > 0 && (
            <Section
              step="✦"
              title="Rekomendasi (K-Means)"
              subtitle="Saran berbasis cluster makanan & gap AKG saat ini"
              tone="emerald"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recommendations.map((r) => (
                  <button
                    key={r.food._id}
                    type="button"
                    onClick={() => addFood(r.food._id)}
                    className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-left transition"
                    data-testid={`rec-${r.food._id}`}
                  >
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900">{r.food.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{r.reason}</div>
                    </div>
                    <Plus size={14} className="text-emerald-600 mt-1" />
                  </button>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right column — Live nutrition analysis (1/3 width) */}
        <div className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* Step 4: AKG Achievement */}
          <Section step={4} title="Pencapaian AKG" subtitle={`Target: ${target} · ${akg.calories} kkal/hari`} compact>
            <AkgBar label="Kalori"      value={fmt(totals.calories, 0)}    unit="kkal" pct={akgPct.calories}     target={akg.calories} />
            <AkgBar label="Protein"     value={fmt(totals.protein, 1)}     unit="g"    pct={akgPct.protein}      target={akg.protein} />
            <AkgBar label="Lemak"       value={fmt(totals.fat, 1)}         unit="g"    pct={akgPct.fat}          target={akg.fat} />
            <AkgBar label="Karbohidrat" value={fmt(totals.carbohydrate, 1)} unit="g"   pct={akgPct.carbohydrate} target={akg.carbohydrate} />
            <AkgBar label="Serat"       value={fmt(totals.fiber, 1)}       unit="g"    pct={akgPct.fiber}        target={akg.fiber} />
          </Section>

          {/* Step 5: Nutrition Status */}
          <Section
            step={5}
            title="Status Nutrisi"
            subtitle="Kesimpulan kelayakan menu"
            compact
            tone={meetsAkg ? "emerald" : "amber"}
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  "h-12 w-12 rounded-xl grid place-items-center",
                  meetsAkg ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
                ].join(" ")}
              >
                {meetsAkg ? <CheckCircle2 size={22} /> : <AlertCircle size={22} />}
              </div>
              <div>
                <div className="text-base font-semibold text-slate-900">
                  {meetsAkg ? "Sesuai AKG" : "Belum Optimal"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Rata-rata: {fmt((akgPct.calories + akgPct.protein + akgPct.fat + akgPct.carbohydrate) / 4, 0)}% AKG
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
              {nutritionAdvice(akgPct)}
            </div>
          </Section>

          {/* Mini stats */}
          <Section compact title="Ringkasan" subtitle="Total per menu">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <MiniStat label="Total Item" value={items.length} />
              <MiniStat label="Total Gram" value={items.reduce((s, it) => s + Number(it.portion_gram || 0), 0)} />
              <MiniStat label="Total Kalori" value={`${fmt(totals.calories, 0)} kkal`} />
              <MiniStat label="Total Protein" value={`${fmt(totals.protein, 1)} g`} />
            </div>
          </Section>
        </div>
      </div>

      {/* Publish confirmation */}
      <Modal
        open={confirmPublish}
        onClose={() => setConfirmPublish(false)}
        title="Publish Menu?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmPublish(false)}>
              Batal
            </Button>
            <Button onClick={() => save("published")} disabled={saving} data-testid="confirm-publish-btn">
              <Send size={14} /> Ya, Publish
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Menu <span className="font-semibold text-slate-900">{name || "Tanpa Nama"}</span> akan dipublikasikan dan dapat diakses oleh aplikasi mobile sekolah.
        </p>
        {!meetsAkg && (
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>
              Menu ini belum sesuai AKG sepenuhnya. Anda tetap dapat publish, namun disarankan untuk dioptimalkan terlebih dahulu.
            </span>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function Section({ step, title, subtitle, children, compact, tone }) {
  const toneCls = {
    emerald: "border-emerald-200 bg-emerald-50/30",
    amber:   "border-amber-200 bg-amber-50/30",
  }[tone];
  return (
    <Card className={toneCls}>
      <div className={`px-${compact ? 4 : 6} py-${compact ? 3 : 4} border-b border-slate-100 flex items-center gap-3`}>
        {step != null && (
          <div className="h-7 w-7 rounded-full bg-emerald-600 text-white text-xs font-bold grid place-items-center shrink-0">
            {step}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className={compact ? "p-4 space-y-3" : "p-6"}>{children}</div>
    </Card>
  );
}

function AkgBar({ label, value, unit, pct, target }) {
  const safe = Math.min(100, Math.max(0, pct || 0));
  const tone =
    pct >= 80 && pct <= 115
      ? "bg-emerald-500"
      : pct < 80
      ? "bg-amber-500"
      : "bg-rose-500";
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="tabular-nums text-slate-900">
          {value} {unit} <span className="text-slate-400">/ {target}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full ${tone} transition-all`} style={{ width: `${safe}%` }} />
      </div>
      <div className="text-[10px] text-slate-500 mt-1 text-right">{pct}% AKG</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-2">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">{label}</div>
      <div className="text-sm font-semibold text-slate-900 mt-1 tabular-nums">{value}</div>
    </div>
  );
}

function pct(value, target) {
  if (!target) return 0;
  return Math.round((value / target) * 100);
}

function fmt(value, dp = 1) {
  if (value == null) return "—";
  return dp === 0 ? Math.round(value).toString() : value.toFixed(dp);
}

function nutritionAdvice(akgPct) {
  const issues = [];
  if (akgPct.calories < 80) issues.push("kalori masih kurang");
  if (akgPct.calories > 115) issues.push("kalori berlebih");
  if (akgPct.protein < 80) issues.push("protein perlu ditambah");
  if (akgPct.protein > 130) issues.push("protein berlebih");
  if (akgPct.fat > 115) issues.push("lemak tinggi");
  if (akgPct.fiber < 60) issues.push("serat kurang (tambahkan sayur/buah)");
  if (issues.length === 0) return "Komposisi sudah seimbang. Menu siap dipublikasikan.";
  return `Catatan: ${issues.join(", ")}.`;
}
