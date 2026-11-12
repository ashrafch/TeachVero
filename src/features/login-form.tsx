"use client";
import { FormReady } from "@/components/ui/form-ready";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <form
      method="post"
      className="form-card"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        const data = new FormData(e.currentTarget);
        try {
          const result = await signIn("credentials", {
            email: data.get("email"),
            password: data.get("password"),
            redirect: false,
          });
          if (result?.error)
            setError("Check your email and password, or try again later.");
          else {
            router.push("/dashboard");
            router.refresh();
          }
        } catch {
          setError("Sign-in unavailable. Please try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <FormReady>
        <h2>Your Italian space.</h2>
        <label>
          Email address
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={200}
          />
        </label>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <button className="button button-dark full" disabled={pending}>
          {pending ? "Signing in…" : "Come on in ↗"}
        </button>
      </FormReady>
    </form>
  );
}
