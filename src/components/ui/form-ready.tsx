"use client";
import type { ReactNode } from "react";
import { useHydrated } from "@/lib/use-hydrated";
export function FormReady({
  children,
  pending = false,
}: {
  children: ReactNode;
  pending?: boolean;
}) {
  const ready = useHydrated();
  return (
    <fieldset className="hydration-guard" disabled={!ready || pending}>
      {children}
    </fieldset>
  );
}
