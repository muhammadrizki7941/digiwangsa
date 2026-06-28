import { getWhatsappNumber } from "@/lib/settings";
import { saveSiteSettings } from "@/lib/admin-actions";
import SubmitButton from "@/components/admin/SubmitButton";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const whatsapp = await getWhatsappNumber();
  const { saved } = await searchParams;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">
        Pengaturan
      </h1>

      {saved && (
        <p className="mb-5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Pengaturan tersimpan.
        </p>
      )}

      <form action={saveSiteSettings} className="card-glass space-y-5 rounded-2xl p-6">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wide text-muted">
            Nomor WhatsApp Admin
          </label>
          <input
            name="whatsapp"
            defaultValue={whatsapp}
            inputMode="tel"
            className="w-full rounded-lg border border-gold-line/50 bg-base px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/70"
            placeholder="6281234567890"
          />
          <p className="mt-1.5 text-xs text-muted">
            Format internasional tanpa tanda + (mis. 62812xxxxxxx). Dipakai untuk
            tombol chat, form konsultasi, dan redirect WhatsApp.
          </p>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
