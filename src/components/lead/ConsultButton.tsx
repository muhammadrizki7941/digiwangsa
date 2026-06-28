"use client";

export const OPEN_CONSULT_EVENT = "open-consultation";

export function openConsultation() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_CONSULT_EVENT));
  }
}

export default function ConsultButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button type="button" onClick={openConsultation} className={className}>
      {children}
    </button>
  );
}
