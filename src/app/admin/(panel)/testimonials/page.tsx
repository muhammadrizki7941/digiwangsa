import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteTestimonial } from "@/lib/admin-actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-cream">Testimonial</h1>
        <Link href="/admin/testimonials/new" className="btn-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
          <Plus size={16} /> Baru
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted">Belum ada testimonial.</p>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="card-glass flex items-start justify-between gap-4 rounded-xl p-5">
              <div>
                <p className="font-medium text-cream">
                  {t.name} <span className="text-muted">· {t.role}{t.company ? `, ${t.company}` : ""}</span>
                </p>
                <p className="mt-1 text-sm text-muted line-clamp-2">“{t.quote}”</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link href={`/admin/testimonials/${t.id}/edit`} className="rounded-lg p-2 text-cream/70 transition hover:bg-elevated hover:text-gold" aria-label="Edit">
                  <Pencil size={16} />
                </Link>
                <DeleteButton action={deleteTestimonial.bind(null, t.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
