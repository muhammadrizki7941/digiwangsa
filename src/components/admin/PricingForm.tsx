import Link from "next/link";
import { savePlan } from "@/lib/admin-actions";
import SubmitButton from "./SubmitButton";

export type PricingFormData = {
  id: string;
  name: string;
  price: string;
  period: string;
  segment: string;
  features: string[];
  highlighted: boolean;
  order: number;
};

const field =
  "w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70";
const label = "mb-1.5 block text-xs uppercase tracking-wide text-muted";

export default function PricingForm({ plan }: { plan?: PricingFormData }) {
  const action = savePlan.bind(null, plan?.id ?? null);

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Nama Paket</label>
          <input name="name" required defaultValue={plan?.name} className={field} placeholder="Starter" />
        </div>
        <div>
          <label className={label}>Segmen</label>
          <input name="segment" required defaultValue={plan?.segment} className={field} placeholder="Untuk kreator & personal" />
        </div>
        <div>
          <label className={label}>Harga</label>
          <input name="price" required defaultValue={plan?.price} className={field} placeholder="Rp 1,5jt / Custom" />
        </div>
        <div>
          <label className={label}>Periode (opsional)</label>
          <input name="period" defaultValue={plan?.period} className={field} placeholder="/ proyek" />
        </div>
      </div>

      <div>
        <label className={label}>Fitur (satu per baris)</label>
        <textarea
          name="features"
          rows={6}
          defaultValue={plan?.features.join("\n")}
          className={field}
          placeholder={"Landing page 1–3 halaman\nDesain responsif premium\nSetup SEO dasar"}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Urutan</label>
          <input name="order" type="number" defaultValue={plan?.order ?? 0} className={field} />
        </div>
        <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm text-cream/85">
          <input name="highlighted" type="checkbox" defaultChecked={plan?.highlighted} className="h-4 w-4 accent-[#c9a24b]" />
          Tandai sebagai paling populer
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Link href="/admin/pricing" className="rounded-full border border-gold-line/60 px-6 py-2.5 text-sm text-cream transition hover:border-gold/70">
          Batal
        </Link>
      </div>
    </form>
  );
}
