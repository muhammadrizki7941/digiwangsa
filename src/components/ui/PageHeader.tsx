import Image from "next/image";

/** Ornamental inner-page header with Javanese background wash. */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-gold-line/20 pt-36 pb-16 lg:pt-44 lg:pb-20">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/asset/background-digiwangsa.png"
          alt=""
          fill
          className="object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-base/70 via-base/85 to-base" />
      </div>

      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-gold">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-semibold leading-[1.1] text-cream sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
