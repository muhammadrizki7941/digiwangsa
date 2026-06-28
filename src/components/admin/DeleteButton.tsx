"use client";

import { Trash2 } from "lucide-react";

/** Confirms before submitting a bound server action form. */
export default function DeleteButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Hapus item ini? Tindakan ini tidak bisa dibatalkan.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg p-2 text-red-300/80 transition hover:bg-red-500/10 hover:text-red-300"
        aria-label="Hapus"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
