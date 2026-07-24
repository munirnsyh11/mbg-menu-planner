import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrapList } from "@/lib/mbg-api";
import {
  Card,
  CardHeader,
  Button,
  Input,
  Select,
  Label,
} from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";

const EMPTY = {
  food_id: "",
  calories: "",
  protein: "",
  fat: "",
  carbohydrate: "",
  fiber: "",
};

export default function Nutritions() {
  const [list, setList] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [n, f] = await Promise.all([
        mbgApi.get("/api/nutritions", { params: { limit: 100 } }),
        mbgApi.get("/api/foods", { params: { limit: 100 } }),
      ]);
      setList(unwrapList(n).data);
      setFoods(unwrapList(f).data);
    } catch (e) {
      setErr(e.response?.data?.message || "Gagal memuat data nutrisi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      food_id: item.food_id?._id || item.food_id,
      calories: item.calories ?? "",
      protein: item.protein ?? "",
      fat: item.fat ?? "",
      carbohydrate: item.carbohydrate ?? "",
      fiber: item.fiber ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    setSaving(true);
    const payload = {
      calories: Number(form.calories),
      protein: Number(form.protein),
      fat: Number(form.fat),
      carbohydrate: Number(form.carbohydrate),
      fiber: Number(form.fiber),
    };
    try {
      if (editing) {
        await mbgApi.put(`/api/nutritions/${form.food_id}`, payload);
        toast.success("Nutrisi diperbarui");
      } else {
        await mbgApi.post("/api/nutritions", { food_id: form.food_id, ...payload });
        toast.success("Nutrisi ditambahkan");
      }
      setModalOpen(false);
      await load();
    } catch (e2) {
      toast.error(e2.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-testid="nutritions-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      <Card>
        <CardHeader
          title="Data Nutrisi"
          subtitle={`${list.length} nutrisi tersimpan · nilai per 100g`}
          action={
            <Button onClick={openAdd} data-testid="add-nutrition-btn">
              <Plus size={14} /> Tambah Nutrisi
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Makanan</th>
                <th className="text-right px-6 py-3 font-medium">Kalori</th>
                <th className="text-right px-6 py-3 font-medium">Protein</th>
                <th className="text-right px-6 py-3 font-medium">Lemak</th>
                <th className="text-right px-6 py-3 font-medium">Karbo</th>
                <th className="text-right px-6 py-3 font-medium">Serat</th>
                <th className="text-right px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Memuat...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Belum ada data nutrisi.
                  </td>
                </tr>
              ) : (
                list.map((n) => (
                  <tr key={n._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {n.food_id?.name || "—"}
                      <div className="text-[11px] text-slate-500">{n.food_id?.category}</div>
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">{n.calories}</td>
                    <td className="px-6 py-3 text-right tabular-nums">{n.protein} g</td>
                    <td className="px-6 py-3 text-right tabular-nums">{n.fat} g</td>
                    <td className="px-6 py-3 text-right tabular-nums">{n.carbohydrate} g</td>
                    <td className="px-6 py-3 text-right tabular-nums">{n.fiber} g</td>
                    <td className="px-6 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(n)}
                        data-testid={`edit-nutrition-${n._id}`}
                      >
                        <Pencil size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Nutrisi" : "Tambah Nutrisi"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={onSubmit} disabled={saving} data-testid="save-nutrition-btn">
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label required>Makanan</Label>
            <Select
              value={form.food_id}
              onChange={(e) => setForm({ ...form, food_id: e.target.value })}
              required
              disabled={!!editing}
            >
              <option value="">Pilih makanan...</option>
              {foods.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.category})
                </option>
              ))}
            </Select>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Nilai berikut adalah <span className="font-medium">per 100 gram</span> bahan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Kalori (kkal)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                required
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
              />
            </div>
            <div>
              <Label required>Protein (g)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                required
                value={form.protein}
                onChange={(e) => setForm({ ...form, protein: e.target.value })}
              />
            </div>
            <div>
              <Label required>Lemak (g)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                required
                value={form.fat}
                onChange={(e) => setForm({ ...form, fat: e.target.value })}
              />
            </div>
            <div>
              <Label required>Karbohidrat (g)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                required
                value={form.carbohydrate}
                onChange={(e) => setForm({ ...form, carbohydrate: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label required>Serat (g)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                required
                value={form.fiber}
                onChange={(e) => setForm({ ...form, fiber: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
