"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn, Loader2 } from "lucide-react";
import { login, type LoginState } from "@/lib/auth-actions";
import Logo from "@/components/ui/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-gold mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <LogIn size={16} />
      )}
      Masuk
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="grid min-h-screen place-items-center bg-base px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="card-glass rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold text-cream">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-muted">
            Masuk untuk mengelola konten Digiwangsa.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70"
                placeholder="admin@digiwangsa.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70"
                placeholder="••••••••"
              />
            </div>

            {state.error && (
              <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {state.error}
              </p>
            )}

            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
