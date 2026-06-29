import Image from "next/image";
import { cn } from "@/lib/utils";

/** Digiwangsa circular badge logo (transparent background, works on light & dark). */
export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/asset/logo-digiwangsa.png"
      alt="Digiwangsa — Digital Solution. Timeless Impact."
      width={1100}
      height={1015}
      priority
      className={cn("h-12 w-auto", className)}
    />
  );
}
