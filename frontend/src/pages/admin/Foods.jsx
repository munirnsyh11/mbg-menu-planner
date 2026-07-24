import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrapList } from "@/lib/mbg-api";
import {
  Card,
  CardHeader,
  Button,
  Input,
  Select,
  Label,
  Textarea,
  Badge,
} from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";
import { FOOD_CATEGORIES } from "@/constants/mbg";

const EMPTY = { name: "", category: "karbohidrat", unit: "gram", description: "" };

export default function Foods() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [confirmDel, setConfirmDel] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await mbgApi.get("/api/foods", {
        params: { search: search || undefined, category: category || undefined, limit: 100 },
      });
      setList(unwrapList(res).data);
    } catch (e) {
      setErr(e.response?.data?.message || "Gagal memuat data makanan.");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  };  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      description: item.description || "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await mbgApi.put(`/api/foods/${editing._id}`, form);
        toast.success("Makanan diperbarui");
      } else {
        await mbgApi.post("/api/foods", form);
        toast.success("Makanan ditambahkan");
      }
      setModalOpen(false);
      await load();
    } catch (e2) {
      toast.error(e2.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    try {
      await mbgApi.delete(`/api/foods/${item._id}`);
      toast.success("Makanan dihapus");
      setConfirmDel(null);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menghapus.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-testid="foods-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      <Card>
        <CardHeader
          title="Daftar Makanan"
          subtitle={`${list.length} makanan tersimpan`}
          action={
            <Button onClick={openAdd} data-testid="add-food-btn">
              <Plus size={14} /> Tambah Makanan
            </Button>
          }
        />

        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Cari makanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="foods-search"
            />
          </div>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-48"
            data-testid="foods-category-filter"
          >
            <option value="">Semua kategori</option>
            {FOOD_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Nama</th>
                <th className="text-left px-6 py-3 font-medium">Kategori</th>
                <th className="text-left px-6 py-3 font-medium">Satuan</th>
                <th className="text-left px-6 py-3 font-medium">Cluster</th>
                <th className="text-right px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    Memuat...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Belum ada makanan. Klik <span className="font-medium">Tambah Makanan</span>.
                  </td>
                </tr>
              ) : (
                list.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{f.name}</td>
                    <td className="px-6 py-3">
                      <Badge tone="slate">{f.category}</Badge>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{f.unit}</td>
                    <td className="px-6 py-3">
                      {f.cluster_label != null ? (
                        <Badge tone="emerald">Cluster {f.cluster_label}</Badge>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(f)}
                          data-testid={`edit-food-${f._id}`}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDel(f)}
                          className="text-rose-600 hover:bg-rose-50"
                          data-testid={`delete-food-${f._id}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Makanan" : "Tambah Makanan"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">
              Batal
            </Button>
            <Button onClick={onSubmit} disabled={saving} type="button" data-testid="save-food-btn">
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label required>Nama</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="cth. Nasi Putih"
              data-testid="food-name-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Kategori</Label>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {FOOD_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label required>Satuan</Label>
              <Input
                required
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="gram"
              />
            </div>
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Deskripsi opsional"
              rows={3}
            />
          </div>
        </form>
      </Modal>

      {/* Confirm delete */}
      <Modal
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="Hapus Makanan?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDel(null)}>
              Batal
            </Button>
            <Button variant="danger" onClick={() => onDelete(confirmDel)}>
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Yakin ingin menghapus{" "}
          <span className="font-semibold text-slate-900">{confirmDel?.name}</span>? Tindakan ini
          tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}
