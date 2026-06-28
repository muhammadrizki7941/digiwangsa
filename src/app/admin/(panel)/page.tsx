import Link from "next/link";
import { Newspaper, Briefcase, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [articleCount, publishedCount, portfolioCount] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "published" } }),
    prisma.portfolio.count(),
  ]);

  const cards = [
    {
      label: "Total Artikel",
      value: articleCount,
      sub: `${publishedCount} published`,
      icon: Newspaper,
      href: "/admin/articles",
    },
    {
      label: "Total Portofolio",
      value: portfolioCount,
      sub: "proyek",
      icon: Briefcase,
      href: "/admin/portfolio",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-cream">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Ringkasan konten Digiwangsa.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="card-glass rounded-2xl p-6 transition hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{c.label}</span>
                <Icon size={20} className="text-gold" />
              </div>
              <p className="mt-3 font-display text-4xl font-bold text-cream">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-muted">{c.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/articles/new"
          className="btn-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          <Plus size={16} />
          Artikel Baru
        </Link>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 rounded-full border border-gold-line/60 px-5 py-2.5 text-sm text-cream transition hover:border-gold/70"
        >
          <Plus size={16} />
          Portofolio Baru
        </Link>
      </div>
    </div>
  );
}
