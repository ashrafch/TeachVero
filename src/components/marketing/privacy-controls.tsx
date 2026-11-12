"use client";
import { useEffect, useSyncExternalStore } from "react";
import { track } from "@/lib/events";
function readConsent() {
  try {
    return localStorage.getItem("teachvero.analytics") === "granted";
  } catch {
    return false;
  }
}
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("teachvero:consent", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("teachvero:consent", listener);
  };
}
export function PrivacyControls() {
  const enabled = useSyncExternalStore(subscribe, readConsent, () => false);
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const href = e.target.closest("a")?.getAttribute("href") || "";
      if (href.startsWith("/book"))
        track(href.includes("package=") ? "package_interest" : "cta_clicked");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return (
    <div className="privacy-controls">
      <button
        type="button"
        aria-pressed={enabled}
        onClick={() => {
          try {
            localStorage.setItem(
              "teachvero.analytics",
              enabled ? "denied" : "granted",
            );
            window.dispatchEvent(new Event("teachvero:consent"));
          } catch {
            /* Unavailable storage keeps optional measurement off. */
          }
        }}
      >
        {enabled
          ? "Disable optional measurement"
          : "Allow optional measurement"}
      </button>
      <small>
        Optional measurement is {enabled ? "on" : "off"}. Local events only; no
        analytics provider or tracking cookies.
      </small>
    </div>
  );
}
