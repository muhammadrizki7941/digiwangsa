import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-base">
      <AdminSidebar name={session.name} />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
