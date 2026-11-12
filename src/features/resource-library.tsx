"use client";
import { useState } from "react";
import { ResourceCards } from "@/components/marketing/cards";
import type { ResourceData } from "@/server/repository";
export function ResourceLibrary({ items }: { items: ResourceData[] }) {
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");
  const topics = ["All", ...new Set(items.map((r) => r.category))];
  const filtered = items.filter(
    (r) =>
      (topic === "All" || r.category === topic) &&
      (r.title + " " + r.excerpt + " " + r.level)
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  return (
    <>
      <div className="library-toolbar">
        <label>
          Find a little Italian
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Try coffee, pronunciation or A1"
          />
        </label>
        <div className="topic-filters" aria-label="Resource topics">
          {topics.map((t) => (
            <button
              key={t}
              className={topic === t ? "active" : ""}
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <p className="library-count" role="status">
        {filtered.length} {filtered.length === 1 ? "lesson" : "lessons"} to
        explore
      </p>
      {filtered.length ? (
        <ResourceCards items={filtered} />
      ) : (
        <div className="notice">
          <h3>A little detour.</h3>
          <p>No lessons match that search.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setSearch("");
              setTopic("All");
            }}
          >
            Show all lessons
          </button>
        </div>
      )}
    </>
  );
}
