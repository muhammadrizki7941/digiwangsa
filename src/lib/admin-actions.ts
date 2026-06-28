"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { setSetting } from "@/lib/settings";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

/* ----------------------------- Articles ----------------------------- */

export async function saveArticle(id: string | null, formData: FormData) {
  await requireAuth();

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = slugify(rawSlug || title);

  const data = {
    title,
    slug,
    excerpt: String(formData.get("excerpt") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    category: String(formData.get("category") || "Umum").trim(),
    readMins: Number(formData.get("readMins")) || 5,
    coverImage: String(formData.get("coverImage") || "").trim() || null,
    status: String(formData.get("status") || "draft"),
  };

  if (id) {
    await prisma.article.update({
      where: { id },
      data: {
        ...data,
        publishedAt:
          data.status === "published" ? new Date() : null,
      },
    });
  } else {
    await prisma.article.create({
      data: {
        ...data,
        publishedAt: data.status === "published" ? new Date() : null,
      },
    });
  }

  revalidatePath("/admin/articles");
  revalidatePath("/blog");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await requireAuth();
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/blog");
}

/* ---------------------------- Portfolio ----------------------------- */

export async function savePortfolio(id: string | null, formData: FormData) {
  await requireAuth();

  const title = String(formData.get("title") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = slugify(rawSlug || title);

  const tech = String(formData.get("tech") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const data = {
    title,
    slug,
    category: String(formData.get("category") || "").trim(),
    client: String(formData.get("client") || "").trim(),
    year: String(formData.get("year") || "").trim(),
    summary: String(formData.get("summary") || "").trim(),
    challenge: String(formData.get("challenge") || "").trim(),
    solution: String(formData.get("solution") || "").trim(),
    result: String(formData.get("result") || "").trim() || null,
    tech,
    accent: String(formData.get("accent") || "from-amber-900/40 to-base").trim(),
    demoUrl: String(formData.get("demoUrl") || "").trim() || null,
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order")) || 0,
    coverImage: String(formData.get("coverImage") || "").trim() || null,
    mobileImage: String(formData.get("mobileImage") || "").trim() || null,
  };

  if (id) {
    await prisma.portfolio.update({ where: { id }, data });
  } else {
    await prisma.portfolio.create({ data });
  }

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function deletePortfolio(id: string) {
  await requireAuth();
  await prisma.portfolio.delete({ where: { id } });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

/* --------------------------- Pricing Plans -------------------------- */

export async function savePlan(id: string | null, formData: FormData) {
  await requireAuth();
  const features = String(formData.get("features") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const data = {
    name: String(formData.get("name") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    period: String(formData.get("period") || "").trim(),
    segment: String(formData.get("segment") || "").trim(),
    features,
    highlighted: formData.get("highlighted") === "on",
    order: Number(formData.get("order")) || 0,
  };

  if (id) await prisma.pricingPlan.update({ where: { id }, data });
  else await prisma.pricingPlan.create({ data });

  revalidatePath("/admin/pricing");
  revalidatePath("/pricing");
  redirect("/admin/pricing");
}

export async function deletePlan(id: string) {
  await requireAuth();
  await prisma.pricingPlan.delete({ where: { id } });
  revalidatePath("/admin/pricing");
  revalidatePath("/pricing");
}

/* -------------------------------- FAQ ------------------------------- */

export async function saveFaq(id: string | null, formData: FormData) {
  await requireAuth();
  const data = {
    question: String(formData.get("question") || "").trim(),
    answer: String(formData.get("answer") || "").trim(),
    order: Number(formData.get("order")) || 0,
  };

  if (id) await prisma.fAQ.update({ where: { id }, data });
  else await prisma.fAQ.create({ data });

  revalidatePath("/admin/faq");
  revalidatePath("/");
  redirect("/admin/faq");
}

export async function deleteFaq(id: string) {
  await requireAuth();
  await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/");
}

/* ---------------------------- Testimonials -------------------------- */

export async function saveTestimonial(id: string | null, formData: FormData) {
  await requireAuth();
  const data = {
    name: String(formData.get("name") || "").trim(),
    role: String(formData.get("role") || "").trim(),
    company: String(formData.get("company") || "").trim() || null,
    quote: String(formData.get("quote") || "").trim(),
    avatar: String(formData.get("avatar") || "").trim() || null,
    order: Number(formData.get("order")) || 0,
  };

  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAuth();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

/* ------------------------------ Leads ------------------------------- */

export async function toggleLeadStatus(id: string, status: string) {
  await requireAuth();
  await prisma.lead.update({
    where: { id },
    data: { status: status === "contacted" ? "new" : "contacted" },
  });
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
  await requireAuth();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}

/* ----------------------------- Settings ----------------------------- */

export async function saveSiteSettings(formData: FormData) {
  await requireAuth();
  const whatsapp = String(formData.get("whatsapp") || "").replace(/[^0-9]/g, "");
  if (whatsapp) await setSetting("whatsapp_number", whatsapp);
  revalidatePath("/");
  redirect("/admin/settings?saved=1");
}
