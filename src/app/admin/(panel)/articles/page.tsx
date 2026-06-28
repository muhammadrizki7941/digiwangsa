import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteArticle } from "@/lib/admin-actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-cream">Artikel</h1>
        <Link
          href="/admin/articles/new"
          className="btn-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          <Plus size={16} />
          Baru
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-muted">Belum ada artikel.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gold-line/30">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold-line/30 bg-base-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Judul</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-gold-line/15 last:border-0">
                  <td className="px-5 py-3 text-cream">{a.title}</td>
                  <td className="px-5 py-3 text-muted">{a.category}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        a.status === "published"
                          ? "rounded-full bg-gold/15 px-2.5 py-1 text-xs text-gold"
                          : "rounded-full bg-elevated px-2.5 py-1 text-xs text-muted"
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/articles/${a.id}/edit`}
                        className="rounded-lg p-2 text-cream/70 transition hover:bg-elevated hover:text-gold"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <DeleteButton action={deleteArticle.bind(null, a.id)} />
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
