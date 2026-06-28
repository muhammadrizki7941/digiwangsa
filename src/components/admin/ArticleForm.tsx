import Link from "next/link";
import { saveArticle } from "@/lib/admin-actions";
import SubmitButton from "./SubmitButton";

export type ArticleFormData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readMins: number;
  coverImage: string | null;
  status: string;
};

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function ArticleForm({
  article,
}: {
  article?: ArticleFormData;
}) {
  const action = saveArticle.bind(null, article?.id ?? null);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={label}>Judul</label>
        <input name="title" required defaultValue={article?.title} className={field} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Slug (kosongkan untuk otomatis)</label>
          <input name="slug" defaultValue={article?.slug} className={field} placeholder="judul-artikel" />
        </div>
        <div>
          <label className={label}>Kategori</label>
          <input name="category" defaultValue={article?.category} className={field} placeholder="Strategi Digital" />
        </div>
      </div>

      <div>
        <label className={label}>Ringkasan (excerpt)</label>
        <textarea name="excerpt" required rows={2} defaultValue={article?.excerpt} className={field} />
      </div>

      <div>
        <label className={label}>Konten (pisahkan paragraf dengan baris kosong)</label>
        <textarea name="content" required rows={12} defaultValue={article?.content} className={field} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className={label}>Menit baca</label>
          <input name="readMins" type="number" min={1} defaultValue={article?.readMins ?? 5} className={field} />
        </div>
        <div>
          <label className={label}>Cover image URL (opsional)</label>
          <input name="coverImage" defaultValue={article?.coverImage ?? ""} className={field} />
        </div>
        <div>
          <label className={label}>Status</label>
          <select name="status" defaultValue={article?.status ?? "draft"} className={field}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Link
          href="/admin/articles"
          className="rounded-full border border-gold-line/60 px-6 py-2.5 text-sm text-cream transition hover:border-gold/70"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
