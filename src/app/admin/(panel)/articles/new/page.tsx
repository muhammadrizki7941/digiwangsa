import ArticleForm from "@/components/admin/ArticleForm";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">
        Artikel Baru
      </h1>
      <ArticleForm />
    </div>
  );
}
