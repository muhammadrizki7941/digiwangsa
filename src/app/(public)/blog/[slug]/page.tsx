import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Clock } from "lucide-react";
import CTASection from "@/components/home/CTASection";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/content";
import type { Locale } from "@/i18n/config";

export async function generateStaticParams() {
  const posts = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.article.findUnique({ where: { slug } });
  if (!post) return { title: "Not Found — Digiwangsa" };
  return {
    title: `${post.metaTitle || post.title} — Digiwangsa`,
    description: post.metaDesc || post.excerpt,
  };
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.article.findUnique({ where: { slug } });
  if (!post || post.status !== "published") notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("blog");
  const paragraphs = post.content.split("\n\n");

  return (
    <>
      <article className="pt-32 lg:pt-40">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
          >
            <ArrowLeft size={16} />
            {t("backToList")}
          </Link>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gold">
            {post.category}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center gap-4 text-sm text-muted">
            <span>
              {formatDate(
                (post.publishedAt ?? post.createdAt).toISOString(),
                locale
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readMins} {t("minRead")}
            </span>
          </div>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-cream/85">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
