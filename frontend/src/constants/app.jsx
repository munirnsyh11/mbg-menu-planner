// App-wide constants
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "...";
export const API = `${BACKEND_URL}/api`;

// React Query
export const QUERY_STALE_TIME_MS = 60_000;

// Canvas
export const CANVAS_PADDING_PX = 96;

// Default container size (before first ResizeObserver tick)
export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 800;

// UI delays
export const SCREENSHOT_SETTLE_MS = 700;

// Screen ID prefixes
export const WEB_PREFIX = "web-";
export const MOBILE_PREFIX = "mobile-";

// Scopes
export const SCOPE_ALL = "all";
export const SCOPE_WEB = "web";
export const SCOPE_MOBILE = "mobile";
