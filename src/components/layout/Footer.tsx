import Link from "next/link";
import { useTranslations } from "next-intl";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const explore = [
    { href: "/services", label: nav("services") },
    { href: "/portfolio", label: nav("portfolio") },
    { href: "/pricing", label: nav("pricing") },
    { href: "/blog", label: nav("blog") },
  ];

  return (
    <footer
      id="contact"
      className="relative border-t border-gold-line/30 bg-base-2"
    >
      <div className="glow-gold pointer-events-none absolute inset-x-0 top-0 h-40" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {t("desc")}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
            {t("explore")}
          </h4>
          <ul className="space-y-2.5">
            {explore.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-cream/80 transition hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">
            {t("contact")}
          </h4>
          <ul className="space-y-2.5 text-sm text-cream/80">
            <li>halo@digiwangsa.com</li>
            <li>WhatsApp: +62 8xx-xxxx-xxxx</li>
            <li>Yogyakarta, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-line/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted sm:flex-row lg:px-8">
          <span>© {new Date().getFullYear()} Digiwangsa. {t("rights")}</span>
          <span className="text-gold/70">{t("tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
