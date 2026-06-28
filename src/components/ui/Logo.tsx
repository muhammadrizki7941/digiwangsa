import Image from "next/image";
import { cn } from "@/lib/utils";

/** Digiwangsa lockup. The logo art sits on black, so in light mode we place it on a
 * dark plate (mix-blend-lighten keeps it crisp); in dark mode the plate is transparent. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-lg bg-[#0b0a08] px-2.5 py-1 dark:bg-transparent dark:p-0",
        className
      )}
    >
      <Image
        src="/asset/logo-digiwangsa.png"
        alt="Digiwangsa — Digital Solution. Timeless Impact."
        width={1536}
        height={1024}
        priority
        className="h-12 w-auto mix-blend-lighten"
      />
    </span>
  );
}
