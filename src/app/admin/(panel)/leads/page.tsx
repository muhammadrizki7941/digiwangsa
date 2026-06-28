import { MessageCircle, Mail, CheckCircle2, Circle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toggleLeadStatus, deleteLead } from "@/lib/admin-actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-cream">Pelanggan</h1>
        <span className="text-sm text-muted">{leads.length} permintaan</span>
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-muted">Belum ada permintaan konsultasi.</p>
      ) : (
        <div className="space-y-4">
          {leads.map((l) => (
            <div key={l.id} className="card-glass rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-cream">
                      {l.name}
                    </h2>
                    <span
                      className={
                        l.status === "contacted"
                          ? "rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] text-emerald-300"
                          : "rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] text-gold"
                      }
                    >
                      {l.status === "contacted" ? "Dihubungi" : "Baru"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {l.business ? `${l.business} · ` : ""}
                    {l.createdAt.toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={`https://wa.me/${l.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-emerald-300/90 transition hover:bg-elevated"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </a>
                  <a
                    href={`mailto:${l.email}`}
                    className="rounded-lg p-2 text-cream/70 transition hover:bg-elevated hover:text-gold"
                    aria-label="Email"
                  >
                    <Mail size={16} />
                  </a>
                  <form action={toggleLeadStatus.bind(null, l.id, l.status)}>
                    <button
                      type="submit"
                      className="rounded-lg p-2 text-cream/70 transition hover:bg-elevated hover:text-gold"
                      aria-label="Toggle status"
                    >
                      {l.status === "contacted" ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                  </form>
                  <DeleteButton action={deleteLead.bind(null, l.id)} />
                </div>
              </div>

              <div className="mt-4 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                <p className="text-muted">WhatsApp: <span className="text-cream">{l.whatsapp}</span></p>
                <p className="text-muted">Email: <span className="text-cream">{l.email}</span></p>
                {l.social && <p className="text-muted">Sosial: <span className="text-cream">{l.social}</span></p>}
              </div>

              <p className="mt-4 whitespace-pre-wrap border-t border-gold-line/20 pt-4 text-sm leading-relaxed text-cream/85">
                {l.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
