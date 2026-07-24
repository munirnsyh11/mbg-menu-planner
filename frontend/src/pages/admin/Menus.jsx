import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  CalendarDays,
  Search,
  AlertCircle,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowRight,
  Loader2,
  Inbox,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { mbgApi, unwrapList } from "@/lib/mbg-api";
import {
  Card,
  CardHeader,
  Button,
  Input,
  Select,
  Badge,
} from "@/components/admin/ui";
import Modal from "@/components/admin/Modal";

function formatDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Menus() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await mbgApi.get("/api/menus", {
        params: {
          // Note: backend listMenuQuerySchema supports status, meets_akg,
          // date_from, date_to, sort_order, page, limit — not freetext search.
          status: statusFilter || undefined,
          page,
          limit: 10,
        },
      });
      const u = unwrapList(res);
      setList(u.data);
      setPagination(u.pagination);
    } catch (e) {
      setErr(e.response?.data?.message || "Gagal memuat menu.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const publish = async (m) => {
    try {
      await mbgApi.put(`/api/menus/${m._id}`, { status: "published" });
      toast.success("Menu dipublikasikan");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal publish");
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null); // menu object to delete
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await mbgApi.delete(`/api/menus/${deleteTarget._id}`);
      toast.success(`Menu "${deleteTarget.menu_name}" berhasil dihapus`);
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Gagal menghapus menu");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" data-testid="menus-page">
      {err && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {err}
        </div>
      )}

      {/* Hero banner — Menu Planner is the main module */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
          <Sparkles size={200} className="absolute -right-10 -top-10" />
        </div>
        <div className="relative flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90 mb-2">
              <Sparkles size={12} /> Core Transaction · Main Module
            </div>
            <h1 className="text-2xl font-bold mb-1.5">Menu Planner Workspace</h1>
            <p className="text-sm text-emerald-50 max-w-lg">
              Workspace utama untuk menyusun menu harian. Pilih makanan, lihat kalkulasi nutrisi otomatis, analisis AKG, dan publish menu untuk diakses sekolah.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <Step n={1} label="Info Menu" />
              <ArrowRight size={12} className="opacity-70" />
              <Step n={2} label="Pilih Makanan" />
              <ArrowRight size={12} className="opacity-70" />
              <Step n={3} label="Kalkulasi" />
              <ArrowRight size={12} className="opacity-70" />
              <Step n={4} label="AKG" />
              <ArrowRight size={12} className="opacity-70" />
              <Step n={5} label="Review" />
              <ArrowRight size={12} className="opacity-70" />
              <Step n={6} label="Publish" />
            </div>
          </div>
          <Link to="/admin/menus/new">
            <button
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl px-5 py-3 text-sm flex items-center gap-2 shadow-sm whitespace-nowrap"
              data-testid="new-menu-btn"
            >
              <Plus size={16} /> Buat Menu Baru
            </button>
          </Link>
        </div>
      </div>

      {/* Filters + list */}
      <Card>
        <CardHeader
          title="Riwayat Menu"
          subtitle={pagination ? `${pagination.total || list.length} menu tersimpan` : "Daftar menu"}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari menu..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 w-56"
                  data-testid="menu-search"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-40"
                data-testid="menu-status-filter"
              >
                <option value="">Semua status</option>
                <option value="draft">Draft</option>
                <option value="published">Terbit</option>
              </Select>
            </div>
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
                <th className="text-right px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    <Loader2 size={18} className="animate-spin inline" /> Memuat...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Inbox size={28} className="mx-auto text-slate-300 mb-2" />
                    <div className="text-sm font-medium text-slate-700">Belum ada menu</div>
                    <div className="text-xs text-slate-500 mt-1 mb-3">
                      Mulai buat menu harian pertama Anda di workspace.
                    </div>
                    <Link to="/admin/menus/new">
                      <Button size="sm">
                        <Plus size={12} /> Buat Menu
                      </Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                list
                  .filter((m) =>
                    search
                      ? m.menu_name?.toLowerCase().includes(search.trim().toLowerCase())
                      : true
                  )
                  .map((m) => (
                  <tr
                    key={m._id}
                    className="hover:bg-slate-50"
                    data-testid={`menu-row-${m._id}`}
                  >
                    <td className="px-6 py-3 text-slate-700 flex items-center gap-2">
                      <CalendarDays size={14} className="text-slate-400" />
                      {formatDate(m.menu_date)}
                    </td>
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
                        {m.meets_akg ? (
                          <>
                            <CheckCircle2 size={10} /> Sesuai
                          </>
                        ) : (
                          "Belum"
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit — opens MenuWorkspace in edit mode */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/admin/menus/${m._id}`)}
                          data-testid={`edit-${m._id}`}
                          title="Edit menu"
                        >
                          <Pencil size={12} />
                        </Button>

                        {/* Publish — only for drafts */}
                        {m.status === "draft" && (
                          <Button
                            size="sm"
                            onClick={() => publish(m)}
                            data-testid={`publish-${m._id}`}
                          >
                            <Send size={12} /> Publish
                          </Button>
                        )}

                        {/* Delete */}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteTarget(m)}
                          data-testid={`delete-${m._id}`}
                          title="Hapus menu"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
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
              Halaman {pagination.page} dari{" "}
              {Math.ceil(pagination.total / pagination.limit)}
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
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

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        title="Hapus Menu"
        onClose={() => !deleting && setDeleteTarget(null)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deleting}
              data-testid="confirm-delete-btn"
            >
              {deleting ? (
                <><Loader2 size={13} className="animate-spin" /> Menghapus...</>
              ) : (
                <><Trash2 size={13} /> Ya, Hapus</>
              )}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-700">
          Apakah Anda yakin ingin menghapus menu{" "}
          <span className="font-semibold">"{deleteTarget?.menu_name}"</span>?
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Seluruh komposisi makanan pada menu ini akan ikut dihapus dan tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}

function Step({ n, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-5 w-5 rounded-full bg-white/20 grid place-items-center text-[10px] font-bold">
        {n}
      </span>
      <span className="opacity-90">{label}</span>
    </div>
  );
}
