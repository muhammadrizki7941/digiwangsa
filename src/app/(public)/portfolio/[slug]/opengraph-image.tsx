import { prisma } from "@/lib/prisma";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-card";

export const alt = "Digiwangsa Project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.portfolio.findUnique({ where: { slug } });

  return ogCard({
    eyebrow: project?.category || "Portfolio",
    title: project?.title || "Digiwangsa",
    meta: project ? `${project.client} · ${project.year}` : "digiwangsa.com",
  });
}
