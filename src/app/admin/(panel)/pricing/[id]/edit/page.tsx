import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PricingForm from "@/components/admin/PricingForm";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await prisma.pricingPlan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">Edit Paket</h1>
      <PricingForm
        plan={{
          id: plan.id,
          name: plan.name,
          price: plan.price,
          period: plan.period,
          segment: plan.segment,
          features: Array.isArray(plan.features) ? (plan.features as string[]) : [],
          highlighted: plan.highlighted,
          order: plan.order,
        }}
      />
    </div>
  );
}
