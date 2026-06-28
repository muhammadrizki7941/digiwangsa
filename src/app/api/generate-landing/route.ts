import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const DAILY_LIMIT = 2;

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

type Preset = { palette: string; fonts: string; vibe: string };

const THEME_PRESETS: Record<string, Preset> = {
  "Modern Minimal": {
    palette: "off-white #fafaf9 background, ink #0a0a0a text, ONE refined accent (emerald #10b981 or indigo #6366f1). Lots of negative space.",
    fonts: "'Space Grotesk' for headings + 'Inter' for body.",
    vibe: "Editorial, calm, airy. Thin 1px borders, oversized headlines, generous whitespace, tasteful small labels, subtle dividers. Apple-like restraint.",
  },
  "Bold & Vibrant": {
    palette: "vivid gradients (fuchsia #d946ef → orange #fb923c → amber), high-contrast dark sections, pops of lime/cyan.",
    fonts: "'Archivo' (heavy 800/900) for headings + 'Inter' for body.",
    vibe: "Energetic, punchy, oversized type, gradient blobs/mesh, big rounded buttons, playful asymmetric layout, sticker-like badges.",
  },
  "Elegant Luxury": {
    palette: "deep charcoal/near-black #0b0b0c, warm gold #c9a24b accents, cream text #f5f1e6.",
    fonts: "'Playfair Display' for headings + 'Inter' / 'Jost' for body.",
    vibe: "Refined, premium, lots of breathing room, gold hairline borders, soft glows, serif elegance, slow fade-in animations.",
  },
  "Playful & Creative": {
    palette: "soft pastels (lilac, mint, peach) on cream, bright accents, rounded everything.",
    fonts: "'Poppins' headings + 'Quicksand' body.",
    vibe: "Friendly, rounded-3xl cards, blob shapes, doodle accents, bouncy hover effects, cheerful and approachable.",
  },
  "Corporate Professional": {
    palette: "navy #0f172a, blue accent #2563eb, slate grays, white sections.",
    fonts: "'IBM Plex Sans' or 'Inter' throughout.",
    vibe: "Trustworthy, structured grid, clean cards with soft shadows, stats band, logo cloud, crisp and corporate but modern.",
  },
  "Dark Tech": {
    palette: "near-black #0a0a0f, neon cyan #22d3ee + violet #8b5cf6 glows, subtle grid lines.",
    fonts: "'Space Grotesk' headings + 'JetBrains Mono' accents + 'Inter' body.",
    vibe: "Futuristic SaaS: glassmorphism cards (backdrop-blur, border-white/10), gradient glow orbs, grid background, glowing buttons, mono labels.",
  },
};

const SYSTEM = `You are an award-winning (Awwwards / Dribbble top-shelf) senior web designer & front-end engineer at Digiwangsa. Your work is breathtaking, modern, and detail-obsessed.

Output ONLY a complete, single-file HTML5 document. NO markdown, NO code fences, NO commentary — start with <!DOCTYPE html>.

TECH:
- <script src="https://cdn.tailwindcss.com"></script> in <head>.
- Configure Tailwind theme inline via tailwind.config (custom colors + fontFamily) in a <script> after the CDN.
- Import the specified Google Fonts via <link>.
- Add scroll animations with AOS: <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"> + <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script> and AOS.init() before </body>; sprinkle data-aos on sections.

DESIGN BAR (make it genuinely stunning, NOT a generic template):
- A large, confident hero: oversized display headline (clamp/text-6xl+), gradient or layered background (mesh, glow orbs, or subtle grid), a real product/visual using https://placehold.co, dual CTAs, and small trust signals.
- Rich sections: feature/services grid (use an asymmetric or BENTO layout, not 3 identical boxes), a stats band with big numbers, an about/why-us split with image, a testimonial, a pricing or process section, FAQ, and a strong final CTA + footer.
- Micro-interactions: smooth hover transforms (scale/translate/shadow), transitions on everything interactive, sticky navbar that uses backdrop-blur.
- Depth & polish: rounded-2xl/3xl, layered shadows, gradient text on key words, generous spacing scale, consistent vertical rhythm, badges/pills, iconography via inline SVG.
- Fully responsive (mobile-first), accessible contrast, semantic HTML.
- Write REAL, persuasive marketing copy tailored to the business — NO lorem ipsum. Match the LANGUAGE of the business description.
- It is a STATIC visual mockup (no backend). Aim for "wow, an agency made this."`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "AI belum dikonfigurasi." },
      { status: 503 }
    );
  }

  let business = "";
  let description = "";
  let theme = "";
  try {
    const b = await req.json();
    business = String(b.business || "").trim().slice(0, 120);
    description = String(b.description || "").trim().slice(0, 1500);
    theme = String(b.theme || "Modern Minimal").trim().slice(0, 60);
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  if (!business || !description) {
    return NextResponse.json(
      { error: "Nama bisnis dan deskripsi wajib diisi." },
      { status: 400 }
    );
  }

  const ip = clientIp(req);
  const day = today();
  const used = await prisma.landingGeneration.count({ where: { ip, day } });
  if (used >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Batas 2 generate per hari tercapai. Coba lagi besok ya!", limit: true, remaining: 0 },
      { status: 429 }
    );
  }

  try {
    const preset = THEME_PRESETS[theme] || THEME_PRESETS["Modern Minimal"];
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Design a stunning landing page.

BUSINESS NAME: ${business}
ABOUT THE BUSINESS: ${description}

VISUAL THEME: "${theme}"
- Color palette: ${preset.palette}
- Typography: ${preset.fonts}
- Mood & techniques: ${preset.vibe}

Commit fully to this theme. Make it portfolio-worthy and unmistakably premium. Output the full HTML document only.`,
        },
      ],
      max_tokens: 8000,
      temperature: 0.85,
    });

    let html = completion.choices[0]?.message?.content?.trim() || "";
    // strip accidental markdown fences
    html = html.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/i, "").trim();

    if (!html.toLowerCase().includes("<html") && !html.toLowerCase().includes("<!doctype")) {
      html = `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://cdn.tailwindcss.com"></script></head><body>${html}</body></html>`;
    }

    await prisma.landingGeneration.create({
      data: { ip, day, business, theme },
    });

    return NextResponse.json({ html, remaining: DAILY_LIMIT - (used + 1) });
  } catch (e) {
    console.error("generate-landing error:", e);
    return NextResponse.json(
      { error: "Gagal membuat landing page. Coba lagi sebentar." },
      { status: 500 }
    );
  }
}
