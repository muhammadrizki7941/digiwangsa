import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortfolioForm from "@/components/admin/PortfolioForm";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.portfolio.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">
        Edit Portofolio
      </h1>
      <PortfolioForm
        project={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          category: project.category,
          client: project.client,
          year: project.year,
          summary: project.summary,
          challenge: project.challenge,
          solution: project.solution,
          result: project.result,
          tech: Array.isArray(project.tech) ? (project.tech as string[]) : [],
          accent: project.accent,
          demoUrl: project.demoUrl,
          featured: project.featured,
          order: project.order,
          coverImage: project.coverImage,
          mobileImage: project.mobileImage,
        }}
      />
    </div>
  );
}
