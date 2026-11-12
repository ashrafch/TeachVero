"use client";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
export function MobileCTA() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="mobile-cta">
      <Link href="/book">
        Request an intro <span aria-hidden="true">↗</span>
      </Link>
      <button
        type="button"
        aria-label="Dismiss booking shortcut"
        onClick={() => setDismissed(true)}
      >
        <X size={18} />
      </button>
    </div>
  );
}
