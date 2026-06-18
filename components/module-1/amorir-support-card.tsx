import {
  AMORIR_SUPPORT,
  buildSupportChecklist,
  buildSupportMailto,
  buildSupportMessage,
  buildSupportTitle,
} from "@/lib/module-1/amorir-support";
import type { IntakePayload } from "@/lib/module-1/types";

type AmorirSupportCardProps = {
  payload?: IntakePayload;
  compact?: boolean;
};

export function AmorirSupportCard({
  payload,
  compact = false,
}: AmorirSupportCardProps) {
  const checklist = buildSupportChecklist(payload);

  return (
    <section className="rounded-[2rem] border border-[rgba(64,99,74,0.16)] bg-[linear-gradient(180deg,rgba(225,238,229,0.92),rgba(255,255,255,0.96))] p-6 shadow-[0_24px_70px_rgba(64,99,74,0.08)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--success-strong)]">
            Acompanamiento humano
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--ink)]">
            {buildSupportTitle(payload)}
          </h2>
          <p className="mt-3 text-base leading-8 text-[var(--muted-strong)]">
            {buildSupportMessage(payload)}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-xs">
          <a
            href={buildSupportMailto(payload)}
            className="inline-flex items-center justify-center rounded-full bg-[var(--success-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
          >
            Escribir a AMORir
          </a>
          <a
            href={AMORIR_SUPPORT.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(64,99,74,0.24)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
          >
            Visitar amorir.org
          </a>
          <a
            href={AMORIR_SUPPORT.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[rgba(64,99,74,0.16)] bg-white/90 px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white"
          >
            Instagram de AMORir
          </a>
        </div>
      </div>

      <div
        className={`mt-6 grid gap-3 ${
          compact ? "md:grid-cols-2" : "md:grid-cols-3"
        }`}
      >
        {checklist.map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-white/70 bg-white/85 p-4 text-sm leading-7 text-[var(--muted-strong)]"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
