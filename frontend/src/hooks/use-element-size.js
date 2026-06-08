import { useEffect, useState } from "react";
import {
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from "@/constants/app";

export function useElementSize(ref) {
  const [size, setSize] = useState({
    w: DEFAULT_CANVAS_WIDTH,
    h: DEFAULT_CANVAS_HEIGHT,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
