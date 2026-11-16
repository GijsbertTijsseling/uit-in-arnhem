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
