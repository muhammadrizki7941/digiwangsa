"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";

export default function SubmitButton({ label = "Simpan" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-gold flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Save size={16} />
      )}
      {label}
    </button>
  );
}
