import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deletePlan } from "@/lib/admin-actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPricingPage() {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-cream">Harga</h1>
        <Link href="/admin/pricing/new" className="btn-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
          <Plus size={16} /> Baru
        </Link>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted">Belum ada paket.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gold-line/30">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold-line/30 bg-base-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Paket</th>
                <th className="px-5 py-3">Harga</th>
                <th className="px-5 py-3">Segmen</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-gold-line/15 last:border-0">
                  <td className="px-5 py-3 text-cream">
                    <span className="flex items-center gap-2">
                      {p.highlighted && <Star size={13} className="text-gold" />}
                      {p.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{p.price}</td>
                  <td className="px-5 py-3 text-muted">{p.segment}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/pricing/${p.id}/edit`} className="rounded-lg p-2 text-cream/70 transition hover:bg-elevated hover:text-gold" aria-label="Edit">
                        <Pencil size={16} />
                      </Link>
                      <DeleteButton action={deletePlan.bind(null, p.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
