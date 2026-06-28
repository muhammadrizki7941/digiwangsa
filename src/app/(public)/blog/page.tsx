import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, Clock } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/home/CTASection";
import Reveal from "@/components/motion/Reveal";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/content";
import type { Locale } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Blog — Digiwangsa",
  description:
    "Insights on design, code, and digital growth from the Digiwangsa studio.",
};

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as Locale;

  const posts = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <Link
                href={`/blog/${post.slug}`}
                className="card-glass group flex h-full flex-col rounded-2xl p-7"
              >
                <span className="text-[11px] uppercase tracking-[0.18em] text-gold/90">
                  {post.category}
                </span>
                <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-cream">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs text-muted">
                  <span>
                    {formatDate(
                      (post.publishedAt ?? post.createdAt).toISOString(),
                      locale
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {post.readMins} {t("minRead")}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gold transition group-hover:gap-3">
                  {t("readMore")}
                  <ArrowUpRight size={16} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
