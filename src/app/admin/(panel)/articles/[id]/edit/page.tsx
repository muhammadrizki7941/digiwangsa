import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/admin/ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">
        Edit Artikel
      </h1>
      <ArticleForm
        article={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          readMins: article.readMins,
          coverImage: article.coverImage,
          status: article.status,
        }}
      />
    </div>
  );
}
