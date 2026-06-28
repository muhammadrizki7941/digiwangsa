"use client";

import { useActionState } from "react";
import { changeOwnPassword, type FormState } from "@/lib/admin-user-actions";
import SubmitButton from "./SubmitButton";

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function ChangePasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(
    changeOwnPassword,
    {}
  );

  return (
    <form action={action} className="grid max-w-xl gap-4 sm:grid-cols-2">
      <div>
        <label className={label}>Password Baru</label>
        <input name="password" type="password" required minLength={6} className={field} />
      </div>
      <div>
        <label className={label}>Konfirmasi Password</label>
        <input name="confirm" type="password" required minLength={6} className={field} />
      </div>

      {state.error && (
        <p className="sm:col-span-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="sm:col-span-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {state.success}
        </p>
      )}

      <div className="sm:col-span-2">
        <SubmitButton label="Ubah Password" />
      </div>
    </form>
  );
}
