import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">Edit Testimonial</h1>
      <TestimonialForm
        testimonial={{
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          quote: t.quote,
          avatar: t.avatar,
          order: t.order,
        }}
      />
    </div>
  );
}
