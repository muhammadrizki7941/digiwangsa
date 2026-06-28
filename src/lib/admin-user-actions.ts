"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export type FormState = { error?: string; success?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createAdmin(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password)
    return { error: "Semua field wajib diisi." };
  if (!emailRe.test(email)) return { error: "Format email tidak valid." };
  if (password.length < 6)
    return { error: "Password minimal 6 karakter." };

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return { error: "Email sudah terdaftar." };

  const hashed = await bcrypt.hash(password, 10);
  await prisma.admin.create({ data: { name, email, password: hashed } });

  revalidatePath("/admin/admins");
  redirect("/admin/admins");
}

export async function deleteAdmin(id: string) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  // Guards: can't delete yourself, and can't delete the last admin.
  if (session.id === id) return;
  const count = await prisma.admin.count();
  if (count <= 1) return;

  await prisma.admin.delete({ where: { id } });
  revalidatePath("/admin/admins");
}

export async function changeOwnPassword(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 6) return { error: "Password minimal 6 karakter." };
  if (password !== confirm) return { error: "Konfirmasi password tidak cocok." };

  const hashed = await bcrypt.hash(password, 10);
  await prisma.admin.update({
    where: { id: session.id },
    data: { password: hashed },
  });

  return { success: "Password berhasil diperbarui." };
}
