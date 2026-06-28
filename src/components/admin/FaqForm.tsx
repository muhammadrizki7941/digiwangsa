import Link from "next/link";
import { saveFaq } from "@/lib/admin-actions";
import SubmitButton from "./SubmitButton";

export type FaqFormData = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function FaqForm({ faq }: { faq?: FaqFormData }) {
  const action = saveFaq.bind(null, faq?.id ?? null);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={label}>Pertanyaan</label>
        <input name="question" required defaultValue={faq?.question} className={field} />
      </div>
      <div>
        <label className={label}>Jawaban</label>
        <textarea name="answer" required rows={4} defaultValue={faq?.answer} className={field} />
      </div>
      <div className="max-w-[160px]">
        <label className={label}>Urutan</label>
        <input name="order" type="number" defaultValue={faq?.order ?? 0} className={field} />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Link href="/admin/faq" className="rounded-full border border-gold-line/60 px-6 py-2.5 text-sm text-cream transition hover:border-gold/70">
          Batal
        </Link>
      </div>
    </form>
  );
}
