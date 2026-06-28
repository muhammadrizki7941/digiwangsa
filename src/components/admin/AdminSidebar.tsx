"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Tag,
  HelpCircle,
  Quote,
  Users,
  Contact,
  MessagesSquare,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Artikel", icon: Newspaper },
  { href: "/admin/portfolio", label: "Portofolio", icon: Briefcase },
  { href: "/admin/pricing", label: "Harga", icon: Tag },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/testimonials", label: "Testimonial", icon: Quote },
  { href: "/admin/leads", label: "Pelanggan", icon: Contact },
  { href: "/admin/inbox", label: "Live Chat", icon: MessagesSquare },
  { href: "/admin/admins", label: "Admin", icon: Users },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gold-line/30 bg-base-2 p-5">
      <div className="mb-8">
        <span className="font-display text-xl font-semibold text-cream">
          Digiwangsa
        </span>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                active
                  ? "bg-elevated text-gold"
                  : "text-cream/80 hover:bg-elevated hover:text-cream"
              )}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gold-line/20 pt-4">
        <p className="px-3 pb-1 text-xs text-muted">{name}</p>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream/80 transition hover:bg-elevated"
        >
          <ExternalLink size={17} />
          Lihat Situs
        </a>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300/90 transition hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
