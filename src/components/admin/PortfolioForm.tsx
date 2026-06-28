import Link from "next/link";
import { savePortfolio } from "@/lib/admin-actions";
import SubmitButton from "./SubmitButton";
import ImageUpload from "./ImageUpload";

export type PortfolioFormData = {
  id: string;
  title: string;
  slug: string;
  category: string;
  client: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string | null;
  tech: string[];
  accent: string;
  demoUrl: string | null;
  featured: boolean;
  order: number;
  coverImage: string | null;
  mobileImage: string | null;
};

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function PortfolioForm({
  project,
}: {
  project?: PortfolioFormData;
}) {
  const action = savePortfolio.bind(null, project?.id ?? null);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={label}>Judul Proyek</label>
        <input name="title" required defaultValue={project?.title} className={field} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Slug (kosongkan untuk otomatis)</label>
          <input name="slug" defaultValue={project?.slug} className={field} />
        </div>
        <div>
          <label className={label}>Kategori</label>
          <input name="category" required defaultValue={project?.category} className={field} />
        </div>
        <div>
          <label className={label}>Klien</label>
          <input name="client" required defaultValue={project?.client} className={field} />
        </div>
        <div>
          <label className={label}>Tahun</label>
          <input name="year" required defaultValue={project?.year} className={field} placeholder="2025" />
        </div>
      </div>

      <div>
        <label className={label}>Ringkasan</label>
        <textarea name="summary" required rows={2} defaultValue={project?.summary} className={field} />
      </div>
      <div>
        <label className={label}>Tantangan</label>
        <textarea name="challenge" required rows={3} defaultValue={project?.challenge} className={field} />
      </div>
      <div>
        <label className={label}>Solusi</label>
        <textarea name="solution" required rows={3} defaultValue={project?.solution} className={field} />
      </div>
      <div>
        <label className={label}>Hasil (opsional)</label>
        <textarea name="result" rows={2} defaultValue={project?.result ?? ""} className={field} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ImageUpload
          name="coverImage"
          label="Screenshot Desktop"
          defaultValue={project?.coverImage}
          hint="Tampil di frame browser besar. Rasio 16:9 ideal."
        />
        <ImageUpload
          name="mobileImage"
          label="Screenshot Mobile (opsional)"
          defaultValue={project?.mobileImage}
          hint="Tampil di frame HP slider. Potret/vertikal ideal."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Tech stack (pisahkan dengan koma)</label>
          <input name="tech" defaultValue={project?.tech.join(", ")} className={field} placeholder="Next.js, Prisma, MySQL" />
        </div>
        <div>
          <label className={label}>Demo URL (opsional)</label>
          <input name="demoUrl" defaultValue={project?.demoUrl ?? ""} className={field} />
        </div>
        <div>
          <label className={label}>Accent (gradient Tailwind)</label>
          <input name="accent" defaultValue={project?.accent ?? "from-amber-900/40 to-base"} className={field} />
        </div>
        <div>
          <label className={label}>Urutan</label>
          <input name="order" type="number" defaultValue={project?.order ?? 0} className={field} />
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-cream/85">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={project?.featured}
          className="h-4 w-4 accent-[#c9a24b]"
        />
        Tampilkan sebagai unggulan (featured)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Link
          href="/admin/portfolio"
          className="rounded-full border border-gold-line/60 px-6 py-2.5 text-sm text-cream transition hover:border-gold/70"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
