import AdminUserForm from "@/components/admin/AdminUserForm";

export default function NewAdminPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold text-cream">
        Tambah Admin
      </h1>
      <AdminUserForm />
    </div>
  );
}
