import Link from "next/link";
import { saveTestimonial } from "@/lib/admin-actions";
import SubmitButton from "./SubmitButton";
import ImageUpload from "./ImageUpload";

export type TestimonialFormData = {
  id: string;
  name: string;
  role: string;
  company: string | null;
  quote: string;
  avatar: string | null;
  order: number;
};

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function TestimonialForm({
  testimonial,
}: {
  testimonial?: TestimonialFormData;
}) {
  const action = saveTestimonial.bind(null, testimonial?.id ?? null);

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Nama</label>
          <input name="name" required defaultValue={testimonial?.name} className={field} />
        </div>
        <div>
          <label className={label}>Jabatan / Peran</label>
          <input name="role" required defaultValue={testimonial?.role} className={field} placeholder="Content Creator" />
        </div>
        <div>
          <label className={label}>Perusahaan (opsional)</label>
          <input name="company" defaultValue={testimonial?.company ?? ""} className={field} />
        </div>
        <div>
          <label className={label}>Urutan</label>
          <input name="order" type="number" defaultValue={testimonial?.order ?? 0} className={field} />
        </div>
      </div>

      <div>
        <label className={label}>Kutipan</label>
        <textarea name="quote" required rows={4} defaultValue={testimonial?.quote} className={field} />
      </div>

      <div className="max-w-sm">
        <ImageUpload
          name="avatar"
          label="Foto / Avatar (opsional)"
          defaultValue={testimonial?.avatar}
          hint="Persegi (1:1) ideal."
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Link href="/admin/testimonials" className="rounded-full border border-gold-line/60 px-6 py-2.5 text-sm text-cream transition hover:border-gold/70">
          Batal
        </Link>
      </div>
    </form>
  );
}
