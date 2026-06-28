import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FaqForm from "@/components/admin/FaqForm";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">Edit FAQ</h1>
      <FaqForm faq={{ id: faq.id, question: faq.question, answer: faq.answer, order: faq.order }} />
    </div>
  );
}
