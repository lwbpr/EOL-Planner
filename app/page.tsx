import Link from "next/link";
import { IntakeForm } from "@/components/module-1/intake-form";
import { getDirectoryCounts } from "@/lib/module-1/resource-directory";

export default async function Home() {
  const directoryCounts = await getDirectoryCounts();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-10 md:px-10 lg:px-12">
      <section className="grid gap-8 rounded-[2rem] border border-white/50 bg-white/75 p-8 shadow-[0_24px_80px_rgba(71,60,53,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-1 text-sm font-semibold text-[var(--accent-strong)]">
            Coordinador de Final de Vida
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">
              Orientador digital para Puerto Rico
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">
              Ayuda práctica, clara y localizada para momentos de final de vida.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-strong)]">
              Este primer módulo ayuda a una persona o familia a ubicarse rápido,
              entender qué hacer ahora y ver los recursos más relevantes según su
              situación, su pueblo y el tipo de apoyo que necesita.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                1. Ubica tu situación
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Contesta unas pocas preguntas en español y sin lenguaje técnico.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                2. Recibe orientación útil
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Ve los próximos pasos, advertencias y apoyos que hacen sentido
                para tu caso.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                3. Encuentra recursos cercanos
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                El directorio aparece dentro del flujo, no como una lista fría.
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(113,78,61,0.08),rgba(113,78,61,0.02))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Directorio integrado
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-[var(--line)] bg-white/80 p-4">
              <p className="text-2xl font-semibold text-[var(--ink)]">
                {directoryCounts.total}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">recursos reales integrados</p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-white/80 p-4">
              <p className="text-2xl font-semibold text-[var(--ink)]">
                {directoryCounts.byCategory.hospicio}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">hospicios en el directorio</p>
            </div>
          </div>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted-strong)]">
            <li>Incluye doulas, hospicios y servicios fúnebres.</li>
            <li>Usa los tres spreadsheets compartidos como base del primer directorio real.</li>
            <li>Permite recomendar por necesidad, municipio y etapa del proceso.</li>
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/directorio"
              className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
            >
              Ver directorio completo
            </Link>
            <div className="rounded-3xl border border-dashed border-[var(--line-strong)] bg-white/70 p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Siguiente capa del producto
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              El próximo paso es mover este directorio a Supabase para poder
              curarlo, ampliarlo y actualizarlo sin editar código.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <IntakeForm />
    </main>
  );
}
