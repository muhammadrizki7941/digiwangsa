import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHeader from "@/components/ui/PageHeader";
import CTASection from "@/components/home/CTASection";
import PortfolioShowcase, {
  type ShowcaseProject,
} from "@/components/portfolio/PortfolioShowcase";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Portfolio — Digiwangsa",
  description:
    "Selected digital experiences crafted by Digiwangsa for creators, businesses, and enterprises.",
};

export default async function PortfolioPage() {
  const t = await getTranslations("portfolio");
  const rows = await prisma.portfolio.findMany({ orderBy: { order: "asc" } });

  const projects: ShowcaseProject[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    client: p.client,
    year: p.year,
    summary: p.summary,
    accent: p.accent,
    tech: Array.isArray(p.tech) ? (p.tech as string[]) : [],
    demoUrl: p.demoUrl,
    coverImage: p.coverImage,
    mobileImage: p.mobileImage,
  }));

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16 lg:py-24">
        <PortfolioShowcase projects={projects} viewLabel={t("viewProject")} />
      </section>

      <CTASection />
    </>
  );
}
