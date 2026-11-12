"use client";
import { track } from "@/lib/events";

import { FormReady } from "@/components/ui/form-ready";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { inquirySchema, leadSchema } from "@/lib/validation";
type Inquiry = z.input<typeof inquirySchema>;
export function InquiryForm({
  packages,
  variant = "booking",
}: {
  packages: { id: string; name: string; lessons?: number; duration?: number }[];
  variant?: "booking" | "contact";
}) {
  const query = useSearchParams();
  const started = useRef(false);
  const isBooking = variant === "booking";
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inquiry>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      packageId: packages.some((p) => p.id === query.get("package"))
        ? query.get("package")!
        : "",
      goal: (["beginner", "conversation", "travel", "exam", "other"].includes(
        query.get("goal") || "",
      )
        ? query.get("goal")
        : isBooking
          ? "beginner"
          : "other") as Inquiry["goal"],
      message: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      marketing: false,
      website: "",
      campaign: (query.get("utm_campaign") || query.get("source") || "").slice(
        0,
        100,
      ),
    },
  });
  const packageId = useWatch({ control, name: "packageId" });
  const selected = packages.find((p) => p.id === packageId);
  async function submit(data: Inquiry) {
    setError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error);
      setResult(json.message);
      if (isBooking) track("booking_submitted");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Try again.");
    }
  }
  if (result)
    return (
      <div className="form-card success" role="status">
        <span className="success-mark">✓</span>
        <p className="eyebrow">A LOVELY FIRST STEP</p>
        <h2>
          Grazie, you’re
          <br />
          on your way.
        </h2>
        <p>{result}</p>
        <Link className="button button-outline" href="/learn">
          Explore a little Italian ↗
        </Link>
      </div>
    );
  return (
    <form
      method="post"
      className="form-card"
      onFocus={() => {
        if (isBooking && !started.current) {
          started.current = true;
          track("booking_started");
        }
      }}
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      <FormReady>
        <h2>{isBooking ? "A little about you." : "A note to Veronica."}</h2>
        <p className="muted">
          {isBooking
            ? "All fields are required except package and marketing updates."
            : "Your name, email, message and privacy consent are required."}
        </p>
        {selected && (
          <aside className="selected-plan">
            <p className="eyebrow">YOUR SELECTED PACKAGE</p>
            <h3>{selected.name}</h3>
            <p>
              {selected.lessons} proposed lessons · {selected.duration} minutes
              each
            </p>
            <small>Price and currency confirmed personally.</small>
          </aside>
        )}
        <div className="form-row">
          <label>
            Your name
            <input
              aria-label="Your name"
              autoComplete="name"
              {...register("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <small id="name-error" className="field-error">
                Please enter at least 2 characters.
              </small>
            )}
          </label>
          <label>
            Email address
            <input
              aria-label="Email address"
              type="email"
              spellCheck={false}
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <small id="email-error" className="field-error">
                Enter a valid email address.
              </small>
            )}
          </label>
        </div>
        {isBooking && (
          <>
            <label>
              What brings you here?
              <select {...register("goal")}>
                <option value="beginner">
                  I’m starting from the beginning
                </option>
                <option value="conversation">
                  I want to feel confident speaking
                </option>
                <option value="travel">Travel, life or family in Italy</option>
                <option value="exam">An exam or specific goal</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <div className="form-row">
              <label>
                A package in mind?
                <select {...register("packageId")}>
                  <option value="">Let’s find out together</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Your time zone
                <input
                  autoComplete="off"
                  {...register("timezone")}
                  aria-invalid={!!errors.timezone}
                  aria-describedby={
                    errors.timezone ? "timezone-error" : undefined
                  }
                />
                {errors.timezone && (
                  <small id="timezone-error" className="field-error">
                    Enter your time zone.
                  </small>
                )}
              </label>
            </div>
          </>
        )}
        <label>
          {isBooking ? "Tell me about your Italian" : "Your message"}
          <textarea
            aria-label={
              isBooking ? "Tell me about your Italian" : "Your message"
            }
            rows={4}
            placeholder={
              isBooking
                ? "Your experience, goals and preferred times…"
                : "What would you like to ask Veronica?"
            }
            {...register("message")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <small id="message-error" className="field-error">
              Please write 10–2000 characters.
            </small>
          )}
        </label>
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave empty
            <input tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            {...register("consent")}
            aria-invalid={!!errors.consent}
          />
          <span>
            I agree to my details being used to respond to this inquiry.{" "}
            <Link href="/legal/privacy">Privacy notice</Link>.
          </span>
        </label>
        {errors.consent && (
          <p className="field-error">
            Please agree so we can process your inquiry.
          </p>
        )}
        <label className="checkbox">
          <input type="checkbox" {...register("marketing")} />
          <span>
            Optional: I’d like occasional Italian learning updates. Email
            delivery is not active yet.
          </span>
        </label>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button className="button button-primary full" disabled={isSubmitting}>
          {isSubmitting ? "Saving your inquiry…" : "Send my inquiry ↗"}
        </button>
        <small className="muted">
          Your request is saved for review. No booking, payment or email
          confirmation.
        </small>
      </FormReady>
    </form>
  );
}
export function LeadForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { website: "", marketing: false },
  });
  if (done)
    return (
      <div className="form-card" role="status">
        <h3>Un piccolo regalo.</h3>
        <p>Your guide request is saved. No email has been sent.</p>
        <a
          className="button button-dark"
          href="/conversation-starter.txt"
          download
        >
          Download your free guide ↓
        </a>
      </div>
    );
  return (
    <form
      method="post"
      className="form-card"
      onSubmit={handleSubmit(async (data) => {
        setError("");
        try {
          const r = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, kind: "lead" }),
          });
          if (!r.ok) {
            const j = await r.json();
            throw new Error(j.error);
          }
          setDone(true);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Please try again.");
        }
      })}
      noValidate
    >
      <FormReady>
        <label>
          Your name
          <input
            aria-label="Your name"
            autoComplete="name"
            {...register("name")}
          />
        </label>
        <label>
          Your email
          <input
            aria-label="Your email"
            type="email"
            spellCheck={false}
            autoComplete="email"
            {...register("email")}
          />
        </label>
        <label className="checkbox">
          <input type="checkbox" {...register("consent")} />
          <span>
            I agree to this guide request being stored.{" "}
            <Link href="/legal/privacy">Privacy notice</Link>.
          </span>
        </label>
        <label className="checkbox">
          <input type="checkbox" {...register("marketing")} />
          <span>Optional: send me learning updates when email is active.</span>
        </label>
        <div className="honeypot" aria-hidden="true">
          <input tabIndex={-1} {...register("website")} />
        </div>
        {Object.keys(errors).length > 0 && (
          <p className="field-error" role="alert">
            Check your name, email and required consent.
          </p>
        )}
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <button className="button button-dark full" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Get my free guide ↗"}
        </button>
      </FormReady>
    </form>
  );
}
