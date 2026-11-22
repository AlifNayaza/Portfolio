import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-hot-toast";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Request a resized, auto-format, auto-quality variant of a Cloudinary image.
 * Non-Cloudinary URLs (or URLs that already carry a transformation) are returned untouched.
 */
export function optimizeImage(url, width = 1200) {
  if (typeof url !== "string" || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const [base, rest] = url.split("/upload/");
  // Skip if the first path segment already looks like a transformation (e.g. "w_800,f_auto")
  if (/^[a-z]{1,3}_[^/]+\//.test(rest)) return url;
  return `${base}/upload/f_auto,q_auto,c_limit,w_${width}/${rest}`;
}

/** Copy text with a graceful failure path (clipboard API is unavailable on insecure origins). */
export async function copyText(text, successMessage = "Copied to clipboard!", toastId) {
  try {
    await navigator.clipboard.writeText(text);
    if (navigator.vibrate) navigator.vibrate(25);
    toast.success(successMessage, toastId ? { id: toastId } : undefined);
    return true;
  } catch {
    toast.error("Couldn't copy automatically. Please copy it manually.", toastId ? { id: toastId } : undefined);
    return false;
  }
}

/** Strict numeric route param parser: "3" → 3, "3abc" / "-1" / "" → NaN. */
export function parseIndexParam(value) {
  return /^\d+$/.test(String(value ?? "")) ? Number(value) : NaN;
}

/** Two-digit index label that never turns into "010". */
export function indexLabel(index) {
  return String(index + 1).padStart(2, "0");
}
