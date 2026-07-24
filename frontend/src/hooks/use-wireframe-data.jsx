import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API } from "@/constants/app";

const logError = (err) => {
  if (import.meta.env.MODE === "development") {
    console.error(err);
  }
};

export function useWireframeData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/wireframes`)
      .then((r) => {
        if (!cancelled) setData(r.data);
      })
      .catch((err) => {
        logError(err);
        toast.error("Gagal memuat wireframe. Periksa koneksi backend.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
