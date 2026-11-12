"use client";
import { useHydrated } from "@/lib/use-hydrated";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function SignOut() {
  return (
    <button
      className="button button-outline"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </button>
  );
}
export function ProfileForm({
  name,
  profile,
}: {
  name: string;
  profile: { timezone?: string; goal?: string; progress?: string[] };
}) {
  const hydrated = useHydrated();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <form
      method="post"
      className="form-card"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const form = new FormData(e.currentTarget);
        try {
          const r = await fetch("/api/manage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "profile",
              data: {
                name: form.get("name"),
                timezone: form.get("timezone"),
                goal: form.get("goal"),
                progress: form.getAll("progress"),
              },
            }),
          });
          setMessage(
            r.ok
              ? "Your profile and progress are saved."
              : "Could not save. Check your fields.",
          );
          if (r.ok) router.refresh();
        } catch {
          setMessage("Could not save. Try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <h3>Your learning plan</h3>
      <fieldset className="hydration-guard" disabled={!hydrated || pending}>
        <label>
          Your name
          <input
            name="name"
            defaultValue={name}
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Time zone
          <input
            name="timezone"
            defaultValue={profile.timezone || "Europe/Rome"}
            required
          />
        </label>
        <label>
          My Italian goal
          <textarea
            name="goal"
            defaultValue={profile.goal || ""}
            maxLength={500}
          />
        </label>
        <fieldset>
          <legend>My confidence checklist</legend>
          {[
            ["introduce", "Introduce myself"],
            ["order", "Order something at a café"],
            ["conversation", "Keep a short conversation going"],
          ].map(([id, label]) => (
            <label className="checkbox" key={id}>
              <input
                type="checkbox"
                name="progress"
                value={id}
                defaultChecked={profile.progress?.includes(id)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <button className="button button-dark" disabled={pending}>
          {pending ? "Saving…" : "Save my progress"}
        </button>
      </fieldset>
      <p role="status">{message}</p>
    </form>
  );
}
