"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** The same links stay keyboard-accessible; mobile controls expose offscreen sections. */
export function WorkspaceNavigation({
  active,
  label,
  children,
}: {
  active: string;
  label: string;
  children: React.ReactNode;
}) {
  const nav = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = nav.current;
    if (!element) return;
    const update = () =>
      setEdges({
        start: element.scrollLeft < 2,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
      });
    const selected = element.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    if (selected)
      element.scrollLeft =
        selected.offsetLeft -
        element.offsetLeft -
        (element.clientWidth - selected.offsetWidth) / 2;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [active]);
  return (
    <div className="workspace-navigation">
      <div className="workspace-nav-controls">
        <span>Workspace sections</span>
        <div>
          <button
            type="button"
            aria-label="Previous workspace sections"
            disabled={edges.start}
            onClick={() => nav.current?.scrollBy({ left: -240 })}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="More workspace sections"
            disabled={edges.end}
            onClick={() => nav.current?.scrollBy({ left: 240 })}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <nav ref={nav} aria-label={label}>
        {children}
      </nav>
    </div>
  );
}
