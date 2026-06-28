import { prisma } from "@/lib/prisma";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const alt = "Digiwangsa Article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.article.findUnique({ where: { slug } });

  const date = (post?.publishedAt ?? post?.createdAt ?? new Date())
    .toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });

  return ogCard({
    eyebrow: post?.category || "Blog",
    title: post?.title || "Digiwangsa",
    meta: `${date} · ${post?.readMins ?? 5} min read`,
  });
}
