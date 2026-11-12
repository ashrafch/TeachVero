"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
const links = [
  ["Meet Veronica", "/about"],
  ["Lessons", "/lessons"],
  ["Pricing", "/pricing"],
  ["Learn for free", "/learn"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const path = usePathname();
  return (
    <header
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
      className={"site-header " + (path === "/ciao" ? "social-header" : "")}
    >
      <div className="container header-inner">
        <Link href="/" className="wordmark" aria-label="TeachVero home">
          teach<span>vero</span>
          <i>✳</i>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([name, url]) => (
            <Link
              key={url}
              href={url}
              aria-current={path === url ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="login-link" href="/login">
            Student space
          </Link>
          <Link className="button button-dark header-cta" href="/book">
            Request an intro <ArrowUpRight size={16} />
          </Link>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile navigation"
        >
          {[
            ...links,
            ["Student space", "/login"],
            ["Request an intro", "/book"],
          ].map(([name, url]) => (
            <Link key={url} href={url} onClick={() => setOpen(false)}>
              {name}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
