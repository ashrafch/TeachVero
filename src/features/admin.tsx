"use client";
import { FormReady } from "@/components/ui/form-ready";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { PackageData, ResourceData } from "@/server/repository";
async function save(kind: string, data: unknown, remove = false) {
  const r = await fetch("/api/manage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, data, remove }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error);
}
export function StatusControl({ id, status }: { id: string; status: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <div>
      <label>
        Status
        <select
          aria-label={"Status for inquiry " + id}
          defaultValue={status}
          disabled={pending}
          onChange={async (e) => {
            setPending(true);
            setError("");
            try {
              await save("status", { id, status: e.target.value });
              setError("Saved.");
              router.refresh();
            } catch (e) {
              setError((e as Error).message);
            } finally {
              setPending(false);
            }
          }}
        >
          {["NEW", "REVIEWED", "CONTACTED", "CLOSED"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <small role="status">{pending ? "Saving…" : error}</small>
    </div>
  );
}
function RecordForm({
  kind,
  item,
  isNew,
  onMessage,
}: {
  kind: "package" | "resource";
  item: PackageData | ResourceData;
  isNew: boolean;
  onMessage: (text: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const isPackage = "name" in item;
  async function action(form: HTMLFormElement, remove = false) {
    setPending(true);
    onMessage("");
    const f = new FormData(form);
    const common = { id: String(f.get("id")) };
    const data =
      kind === "package"
        ? {
            ...common,
            name: String(f.get("name")),
            tag: String(f.get("tag")),
            description: String(f.get("description")),
            lessons: Number(f.get("lessons")),
            duration: Number(f.get("duration")),
            features: String(f.get("features"))
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {
            ...common,
            title: String(f.get("title")),
            category: String(f.get("category")),
            level: String(f.get("level")),
            excerpt: String(f.get("excerpt")),
            body: String(f.get("body")),
            color: String(f.get("color")),
          };
    try {
      await save(kind, data, remove);
      onMessage(
        remove ? "Deleted." : "Saved. Public pages use the updated record.",
      );
      router.refresh();
    } catch (e) {
      onMessage(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setPending(false);
    }
  }
  return (
    <form
      method="post"
      className="content-form"
      onSubmit={(e) => {
        e.preventDefault();
        void action(e.currentTarget);
      }}
    >
      <FormReady>
        <label>
          Page identifier
          <input
            name="id"
            defaultValue={isNew ? "" : item.id}
            placeholder={
              kind === "package" ? "conversation-bundle" : "a-little-italian"
            }
            readOnly={!isNew}
            required
            pattern="[a-z0-9-]+"
            maxLength={80}
          />
          <small>
            Lowercase words separated by hyphens. This becomes part of the page
            address.
          </small>
        </label>
        {isPackage ? (
          <>
            <div className="form-row">
              <label>
                Package name
                <input
                  name="name"
                  defaultValue={isNew ? "" : item.name}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </label>
              <label>
                Short label
                <input name="tag" defaultValue={item.tag} maxLength={100} />
              </label>
            </div>
            <label>
              Description
              <textarea
                name="description"
                defaultValue={item.description}
                required
                minLength={10}
                maxLength={500}
              />
            </label>
            <div className="form-row">
              <label>
                Number of lessons
                <input
                  type="number"
                  name="lessons"
                  defaultValue={item.lessons}
                  min={1}
                  max={100}
                  required
                />
              </label>
              <label>
                Minutes per lesson
                <input
                  type="number"
                  name="duration"
                  defaultValue={item.duration}
                  min={15}
                  max={180}
                  required
                />
              </label>
            </div>
            <label>
              What’s included
              <textarea
                name="features"
                defaultValue={item.features.join("\n")}
                rows={4}
                required
              />
              <small>
                One benefit per line, up to eight. Prices remain pending
                confirmation.
              </small>
            </label>
          </>
        ) : (
          <>
            <label>
              Article title
              <input
                name="title"
                defaultValue={isNew ? "" : item.title}
                required
                minLength={3}
                maxLength={150}
              />
            </label>
            <div className="form-row">
              <label>
                Category
                <input name="category" defaultValue={item.category} required />
              </label>
              <label>
                Level and reading time
                <input name="level" defaultValue={item.level} required />
              </label>
            </div>
            <label>
              Short introduction
              <textarea
                name="excerpt"
                defaultValue={item.excerpt}
                required
                minLength={10}
                maxLength={300}
              />
            </label>
            <label>
              Lesson content
              <textarea
                name="body"
                defaultValue={item.body}
                rows={12}
                required
                minLength={50}
                maxLength={20000}
              />
              <small>Leave a blank line between paragraphs.</small>
            </label>
            <label>
              Card colour
              <select name="color" defaultValue={item.color}>
                <option value="mint">Mint</option>
                <option value="lavender">Lavender</option>
                <option value="peach">Peach</option>
              </select>
            </label>
          </>
        )}
        <div className="editor-actions">
          <Button variant="dark" disabled={pending}>
            {pending ? "Saving…" : "Save " + kind}
          </Button>
          {!isNew && (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={(e) => {
                if (confirm("Delete this " + kind + "?"))
                  void action(e.currentTarget.form!, true);
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </FormReady>
    </form>
  );
}
export function ContentEditor({
  kind,
  items,
}: {
  kind: "package" | "resource";
  items: (PackageData | ResourceData)[];
}) {
  const [message, setMessage] = useState("");
  const blank =
    kind === "package"
      ? {
          id: "",
          name: "",
          tag: "NEW CHAPTER",
          description: "Describe the intended learning journey.",
          lessons: 4,
          duration: 50,
          features: ["Personal learning plan"],
        }
      : {
          id: "",
          title: "",
          category: "EVERYDAY ITALIAN",
          level: "A1 · 5 min",
          excerpt: "A practical example for your next conversation.",
          body: "Write your original lesson here. Include useful examples and an activity learners can try for themselves.",
          color: "mint" as const,
        };
  return (
    <div>
      <p>Changes appear on the public website as soon as they are saved.</p>
      {[...items, blank].map((item, index) => (
        <details key={item.id || "new"}>
          <summary>
            {index === items.length
              ? "+ Create " + kind
              : "name" in item
                ? item.name
                : item.title}
          </summary>
          <RecordForm
            kind={kind}
            item={item}
            isNew={index === items.length}
            onMessage={setMessage}
          />
        </details>
      ))}
      <p role="status">{message}</p>
    </div>
  );
}
