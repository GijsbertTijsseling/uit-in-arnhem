import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined, locale = "nl-NL"): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString || "";
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return `${d.toLocaleDateString("nl-NL", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })} om ${d.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return dateString || "";
  }
}

export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function formatPrice(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "–";
  return `€${amount.toFixed(2).replace(".", ",")}`;
}

export function isLogoFallbackImage(url?: string | null): boolean {
  if (!url) return true;
  const normalized = url.trim().toLowerCase();
  return (
    normalized === "/logo.png" ||
    normalized.endsWith("/logo.png") ||
    normalized.includes("/logo-placeholder")
  );
}
