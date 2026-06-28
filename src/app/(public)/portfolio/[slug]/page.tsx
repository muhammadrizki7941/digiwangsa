import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import CTASection from "@/components/home/CTASection";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const projects = await prisma.portfolio.findMany({ select: { slug: true } });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.portfolio.findUnique({ where: { slug } });
  if (!project) return { title: "Not Found — Digiwangsa" };
  return {
    title: `${project.title} — Digiwangsa`,
    description: project.summary,
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.portfolio.findUnique({ where: { slug } });
  if (!project) notFound();

  const t = await getTranslations("portfolio");
  const tech = Array.isArray(project.tech) ? (project.tech as string[]) : [];

  const sections = [
    { label: t("challenge"), text: project.challenge },
    { label: t("solution"), text: project.solution },
    ...(project.result ? [{ label: t("result"), text: project.result }] : []),
  ];

  return (
    <>
      <article className="pt-32 lg:pt-40">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
          >
            <ArrowLeft size={16} />
            {t("backToList")}
          </Link>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gold">
            {project.category} · {project.client} · {project.year}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-cream/85">
            {project.summary}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl px-5 lg:px-8">
          <div
            className={cn(
              "relative flex aspect-[21/9] items-end overflow-hidden rounded-3xl border border-gold-line/40 bg-gradient-to-br p-8",
              project.accent
            )}
          >
            {project.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImage}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            ) : (
              <>
                <div className="glow-gold absolute inset-0 opacity-60" />
                <span className="relative font-display text-7xl font-bold text-gold/20">
                  {project.client}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
          <div className="grid gap-10">
            {sections.map((s) => (
              <div key={s.label}>
                <h2 className="mb-3 font-display text-2xl font-semibold text-gold">
                  {s.label}
                </h2>
                <p className="leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>

          {tech.length > 0 && (
            <div className="mt-12 border-t border-gold-line/30 pt-8">
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
                {t("techStack")}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {tech.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-gold-line/50 bg-elevated px-4 py-1.5 text-sm text-cream/85"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  {t("visit")}
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          )}
        </div>
      </article>

      <CTASection />
    </>
  );
}
