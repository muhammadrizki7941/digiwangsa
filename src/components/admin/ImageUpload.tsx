"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

export default function ImageUpload({
  name,
  defaultValue,
  label,
  hint,
}: {
  name: string;
  defaultValue?: string | null;
  label: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
        {label}
      </label>
      {/* value submitted with the parent form */}
      <input type="hidden" name={name} value={url} readOnly />

      {url ? (
        <div className="relative w-full overflow-hidden rounded-lg border border-gold-line/50 bg-base">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="preview" className="max-h-56 w-full object-contain" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 rounded-full bg-base/80 p-1.5 text-cream transition hover:text-red-300"
            aria-label="Hapus gambar"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-gold-line/50 bg-base px-4 py-8 text-sm text-muted transition hover:border-gold/70 hover:text-cream"
        >
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-gold" />
          ) : (
            <UploadCloud size={22} className="text-gold" />
          )}
          {uploading ? "Mengunggah…" : "Klik untuk unggah gambar"}
          {hint && <span className="text-[11px] text-muted/70">{hint}</span>}
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={onPick}
        className="hidden"
      />
    </div>
  );
}
