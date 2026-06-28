import "server-only";
import nodemailer from "nodemailer";

export type LeadPayload = {
  name: string;
  whatsapp: string;
  email: string;
  business?: string | null;
  social?: string | null;
  description: string;
};

/** Send a lead notification to the admin inbox. No-op if SMTP isn't configured. */
export async function sendLeadEmail(
  lead: LeadPayload
): Promise<{ sent: boolean }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, ADMIN_EMAIL } =
    process.env;

  if (!SMTP_HOST || !ADMIN_EMAIL) return { sent: false };

  const port = Number(SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  const rows: [string, string][] = [
    ["Nama", lead.name],
    ["WhatsApp", lead.whatsapp],
    ["Email", lead.email],
    ["Bisnis", lead.business || "-"],
    ["Sosial Media", lead.social || "-"],
  ];

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#c9a24b">Lead Konsultasi Baru — Digiwangsa</h2>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 10px;color:#777;width:140px">${k}</td><td style="padding:6px 10px;font-weight:600">${v}</td></tr>`
          )
          .join("")}
      </table>
      <h3 style="margin-top:18px">Deskripsi</h3>
      <p style="white-space:pre-wrap;line-height:1.6">${lead.description}</p>
    </div>`;

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to: ADMIN_EMAIL,
    replyTo: lead.email,
    subject: `Lead baru: ${lead.name}${lead.business ? ` (${lead.business})` : ""}`,
    html,
  });

  return { sent: true };
}
