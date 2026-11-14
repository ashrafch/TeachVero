"use client";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useIntroHref } from "../learning-goal-provider";
export function MobileCTA() {
  const [dismissed, setDismissed] = useState(false);
  const introHref = useIntroHref(usePathname());
  if (dismissed) return null;
  return (
    <div className="mobile-cta">
      <Link href={introHref}>
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
