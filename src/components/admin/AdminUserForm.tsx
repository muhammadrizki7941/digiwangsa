"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAdmin, type FormState } from "@/lib/admin-user-actions";
import SubmitButton from "./SubmitButton";

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function AdminUserForm() {
  const [state, action] = useActionState<FormState, FormData>(createAdmin, {});

  return (
    <form action={action} className="max-w-md space-y-5">
      <div>
        <label className={label}>Nama</label>
        <input name="name" required className={field} />
      </div>
      <div>
        <label className={label}>Email</label>
        <input name="email" type="email" required className={field} placeholder="nama@digiwangsa.com" />
      </div>
      <div>
        <label className={label}>Password</label>
        <input name="password" type="password" required minLength={6} className={field} placeholder="Minimal 6 karakter" />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <SubmitButton label="Tambah Admin" />
        <Link href="/admin/admins" className="rounded-full border border-gold-line/60 px-6 py-2.5 text-sm text-cream transition hover:border-gold/70">
          Batal
        </Link>
      </div>
    </form>
  );
}
