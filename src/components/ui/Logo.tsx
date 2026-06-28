import Image from "next/image";
import { cn } from "@/lib/utils";

/** Digiwangsa full lockup logo. Black background is dropped via mix-blend on dark surfaces. */
export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/asset/logo-digiwangsa.png"
      alt="Digiwangsa — Digital Solution. Timeless Impact."
      width={1536}
      height={1024}
      priority
      className={cn("h-14 w-auto mix-blend-lighten", className)}
    />
  );
}
