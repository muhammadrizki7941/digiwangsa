import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { deleteAdmin } from "@/lib/admin-user-actions";
import DeleteButton from "@/components/admin/DeleteButton";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function AdminUsersPage() {
  const session = await getSession();
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-cream">Admin</h1>
          <Link href="/admin/admins/new" className="btn-gold flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
            <Plus size={16} /> Tambah Admin
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gold-line/30">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold-line/30 bg-base-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Dibuat</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => {
                const isSelf = a.id === session?.id;
                const canDelete = !isSelf && admins.length > 1;
                return (
                  <tr key={a.id} className="border-b border-gold-line/15 last:border-0">
                    <td className="px-5 py-3 text-cream">
                      {a.name}
                      {isSelf && (
                        <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold">
                          Anda
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted">{a.email}</td>
                    <td className="px-5 py-3 text-muted">
                      {a.createdAt.toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        {canDelete ? (
                          <DeleteButton action={deleteAdmin.bind(null, a.id)} />
                        ) : (
                          <span className="text-xs text-muted/60">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-semibold text-cream">
          Ubah Password Anda
        </h2>
        <div className="card-glass rounded-2xl p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
