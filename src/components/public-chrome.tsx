"use client";
import { usePathname } from "next/navigation";
export function PublicChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return path === "/admin" ||
    path.startsWith("/admin/") ||
    path === "/dashboard" ||
    path.startsWith("/dashboard/")
    ? null
    : children;
}
