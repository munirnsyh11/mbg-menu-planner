import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Send, AlertCircle, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrapList, unwrap } from "../../components/lib/mbg-api";
import {
  Card,
  CardHeader,
  Button,
  Input,
  Select,
  Label,
  Badge,
} from "../../components/admin/ui";
import Modal from "../../components/admin/Modal";

function formatDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function Menus() {
  const [list, setList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailMenu, setDetailMenu] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await mbgApi.get("/api/menus", {
        params: { status: statusFilter || undefined, limit: 100 },
      });
      setList(unwrapList(res).data);
    } catch (e) {
      setErr(e.response?.data?.message || "Gagal memuat menu.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const publish = async (m) => {
    try {
      await mbgApi.put(`/api/menus/${m._id}`, { status: "published" });
      toast.success("Menu dipublikasikan");
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal publish menu");
    }
  };

  const viewDetail = async (m) => {
    try {
      const d = await mbgApi.get(`/api/menus/${m._id}`).then(unwrap);
      setDetailMenu(d);
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal memuat detail");
    }
  };

  return (
    <div className="space-y-6" data-testid="menus-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      <Card>
        <CardHeader
          title="Menu Planner"
          subtitle={`${list.length} menu tersimpan`}
          action={
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-40"
              >
                <option value="">Semua status</option>
                <option value="draft">Draft</option>
                <option value="published">Terbit</option>
              </Select>
              <Button onClick={() => setCreateOpen(true)} data-testid="create-menu-btn">
                <Plus size={14} /> Buat Menu
              </Button>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Tanggal</th>
                <th className="text-left px-6 py-3 font-medium">Nama</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Kalori</th>
                <th className="text-left px-6 py-3 font-medium">AKG</th>
                <th className="text-right px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Memuat...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Belum ada menu.
                  </td>
                </tr>
              ) : (
                list.map((m) => (
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
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => viewDetail(m)}>
                          Detail
                        </Button>
                        {m.status === "draft" && (
                          <Button size="sm" onClick={() => publish(m)}>
                            <Send size={12} /> Publish
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateMenuModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={load}
      />

      <DetailMenuModal menu={detailMenu} onClose={() => setDetailMenu(null)} />
    </div>
  );
}

function CreateMenuModal({ open, onClose, onSaved }) {
  const [date, setDate] = useState(todayIso());
  const [name, setName] = useState("");
  const [items, setItems] = useState([{ food_id: "", portion_gram: 100 }]);
  const [foods, setFoods] = useState([]);
  const [nutritions, setNutritions] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => {
      setDate(todayIso());
      setName("");
      setItems([{ food_id: "", portion_gram: 100 }]);

      Promise.all([
        mbgApi.get("/api/foods", { params: { limit: 100 } }),
        mbgApi.get("/api/nutritions", { params: { limit: 100 } }),
      ])
        .then(([f, n]) => {
          setFoods(unwrapList(f).data);
          const map = {};
          unwrapList(n).data.forEach((row) => {
            const fid = row.food_id?._id || row.food_id;
            if (fid) map[fid] = row;
          });
          setNutritions(map);
        })
        .catch(() => {});
    }, 0);
    return () => clearTimeout(t);
  }, [open]);

  const totals = useMemo(() => {
    const t = { calories: 0, protein: 0, fat: 0, carbohydrate: 0 };
    for (const it of items) {
      const n = nutritions[it.food_id];
      if (!n) continue;
      const g = Number(it.portion_gram || 0) / 100;
      t.calories     += (n.calories     || 0) * g;
      t.protein      += (n.protein      || 0) * g;
      t.fat          += (n.fat          || 0) * g;
      t.carbohydrate += (n.carbohydrate || 0) * g;
    }
    return t;
  }, [items, nutritions]);

  // Reference AKG values 
  const akgRef = {
  caloriesMin: 600,
  caloriesMax: 800,
  proteinMin: 15,
  fatMax: 25,
  carbohydrateMin: 60,
};
 const akgPct = {
  calories: Math.round((totals.calories / akgRef.caloriesMin) * 100),
  protein: Math.round((totals.protein / akgRef.proteinMin) * 100),
  fat: Math.round((totals.fat / akgRef.fatMax) * 100),
  carbohydrate: Math.round(
    (totals.carbohydrate / akgRef.carbohydrateMin) * 100
  ),
};

  const addItem = () => setItems([...items, { food_id: "", portion_gram: 100 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, patch) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = async (status) => {
    if (!name.trim()) {
      toast.error("Nama menu wajib diisi");
      return;
    }
    const cleanItems = items
      .filter((it) => it.food_id && Number(it.portion_gram) > 0)
      .map((it) => ({ food_id: it.food_id, portion_gram: Number(it.portion_gram) }));
    if (cleanItems.length === 0) {
      toast.error("Tambahkan minimal 1 makanan");
      return;
    }
    const invalidFood = cleanItems.find(
    (it) => !nutritions[it.food_id]
    );
    if (invalidFood) {
      toast.error(
        "Ada makanan yang belum memiliki data nutrisi."
      );
      return;
    }
    setSaving(true);
    try {
      const res = await mbgApi.post("/api/menus", {
        menu_date: date,
        menu_name: name,
        status: "draft",
        items: cleanItems,
      });
      if (status === "published") {
        await mbgApi.put(`/api/menus/${res.data.data._id}`, { status: "published" });
        toast.success("Menu dibuat & dipublikasikan");
      } else {
        toast.success("Menu disimpan sebagai draft");
      }
      onClose();
      onSaved?.();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menyimpan menu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Buat Menu Harian"
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="secondary" onClick={() => submit("draft")} disabled={saving}>
            Simpan Draft
          </Button>
          <Button onClick={() => submit("published")} disabled={saving} data-testid="publish-menu-btn">
            <Send size={14} /> {saving ? "Memproses..." : "Publish Menu"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form left */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Tanggal Menu</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="menu-date-input"
              />
            </div>
            <div>
              <Label required>Nama Menu</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Menu Sehat A"
                data-testid="menu-name-input"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Daftar Makanan</Label>
              <Button variant="ghost" size="sm" onClick={addItem}>
                <Plus size={12} /> Tambah Baris
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Select
                    value={it.food_id}
                    onChange={(e) => updateItem(i, { food_id: e.target.value })}
                    className="flex-1"
                  >
                    <option value="">Pilih makanan...</option>
                    {foods.map((f) => (
                      <option
                        key={f._id}
                        value={f._id}
                        disabled={!nutritions[f._id]}
                      >
                        {f.name} {!nutritions[f._id] ? "(no nutrition)" : ""}
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    value={it.portion_gram}
                    onChange={(e) =>
                      updateItem(i, { portion_gram: Number(e.target.value) })
                    }
                    className="w-28"
                    placeholder="gram"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(i)}
                    className="text-rose-600 hover:bg-rose-50"
                    disabled={items.length === 1}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary right */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sticky top-0">
            <div className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">
              Ringkasan AKG
            </div>
            <div className="space-y-3">
              <AkgBar label="Kalori" value={totals.calories.toFixed(0)} unit="kkal" pct={akgPct.calories} target="600-800"/>
              <AkgBar label="Protein" value={totals.protein.toFixed(1)} unit="g" pct={akgPct.protein} target="≥15" />
              <AkgBar label="Lemak" value={totals.fat.toFixed(1)} unit="g" pct={akgPct.fat} target="≤25" />
              <AkgBar label="Karbo" value={totals.carbohydrate.toFixed(1)} unit="g" pct={akgPct.carbohydrate} target="≥60" />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
              Standar MBG 600–800 kkal, protein ≥15g, lemak ≤25g, karbohidrat ≥60g.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function AkgBar({ label, value, unit, pct, target }) {
  const safe = Math.min(100, Math.max(0, pct || 0));
  const tone = pct >= 80 && pct <= 110 ? "bg-emerald-500" : pct < 80 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="tabular-nums text-slate-900">
          {value} {unit}
          <span className="text-slate-400"> / {target}</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full ${tone} transition-all`} style={{ width: `${safe}%` }} />
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5 text-right">{pct || 0}% AKG</div>
    </div>
  );
}

function DetailMenuModal({ menu, onClose }) {
  if (!menu) return null;
  const akg = menu.akg_percentage || {};
  return (
    <Modal open={!!menu} onClose={onClose} title={menu.menu_name} size="lg">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge tone={menu.status === "published" ? "emerald" : "slate"}>
            {menu.status === "published" ? "Terbit" : "Draft"}
          </Badge>
          <Badge tone={menu.meets_akg ? "emerald" : "amber"}>
            {menu.meets_akg ? (
              <>
                <CheckCircle2 size={10} /> Sesuai AKG
              </>
            ) : (
              "Belum sesuai AKG"
            )}
          </Badge>
          <span className="text-xs text-slate-500">{formatDate(menu.menu_date)}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            ["Kalori", Math.round(menu.total_calories || 0), "kkal", akg.calories],
            ["Protein", (menu.total_protein || 0).toFixed(1), "g", akg.protein],
            ["Lemak", (menu.total_fat || 0).toFixed(1), "g", akg.fat],
            ["Karbo", (menu.total_carbohydrate || 0).toFixed(1), "g", akg.carbohydrate],
          ].map(([label, val, unit, pct]) => (
            <div key={label} className="rounded-lg bg-slate-50 p-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
                {label}
              </div>
              <div className="text-lg font-semibold tabular-nums mt-1">
                {val}
                <span className="text-xs text-slate-500 ml-1">{unit}</span>
              </div>
              {pct != null && (
                <div className="text-[10px] text-emerald-600 mt-0.5">{Math.round(pct)}% AKG</div>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-2">
            Komposisi Makanan
          </div>
          <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
            {(menu.items || []).map((it) => (
              <div key={it._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {it.food_id?.name || "—"}
                  </div>
                  <div className="text-[11px] text-slate-500">{it.food_id?.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm tabular-nums">{it.portion_gram} g</div>
                  <div className="text-[11px] text-slate-500 tabular-nums">
                    {Math.round(it.calories_contrib || 0)} kkal
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
