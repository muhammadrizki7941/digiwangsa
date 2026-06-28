import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deletePortfolio } from "@/lib/admin-actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPortfolioPage() {
  const projects = await prisma.portfolio.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-cream">
          Portofolio
        </h1>
        <Link
          href="/admin/portfolio/new"
          className="btn-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          <Plus size={16} />
          Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted">Belum ada proyek.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gold-line/30">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold-line/30 bg-base-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Judul</th>
                <th className="px-5 py-3">Klien</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-gold-line/15 last:border-0">
                  <td className="px-5 py-3 text-cream">
                    <span className="flex items-center gap-2">
                      {p.featured && <Star size={13} className="text-gold" />}
                      {p.title}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{p.client}</td>
                  <td className="px-5 py-3 text-muted">{p.category}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/portfolio/${p.id}/edit`}
                        className="rounded-lg p-2 text-cream/70 transition hover:bg-elevated hover:text-gold"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeleteButton action={deletePortfolio.bind(null, p.id)} />
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
