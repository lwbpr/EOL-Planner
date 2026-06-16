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
            Orientador Digital para Procesos de Final de Vida
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl font-display text-3xl leading-tight text-[var(--ink)] md:text-5xl">
              Ayuda práctica y personalizada para el final de la vida.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-strong)]">
              Esta sección ayuda a personas o familias a ubicarse,
              entender próximos pasos y ver los recursos más relevantes según su
              situación, su pueblo y el tipo de apoyo que necesita.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                1. Ubica tu situación
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Contesta unas pocas preguntas y en lenguaje sencillo.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                2. Recibe orientación útil
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Evalúa las sugerencias de próximos pasos, advertencias y apoyos según hagan sentido
                para tu situación.
              </p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                3. Encuentra recursos cercanos
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Encuentra recursos puntuales del directorio filtrados a partir de tus respuestas.
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
              <p className="mt-1 text-sm text-[var(--muted)]">Todos los recursos</p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-white/80 p-4">
              <p className="text-2xl font-semibold text-[var(--ink)]">
                {directoryCounts.byCategory.doula}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">Doulas de Final de Vida</p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-white/80 p-4">
              <p className="text-2xl font-semibold text-[var(--ink)]">
                {directoryCounts.byCategory.hospicio}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">\Hospicios</p>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-white/80 p-4">
              <p className="text-2xl font-semibold text-[var(--ink)]">
                {directoryCounts.byCategory.servicio_funebre}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Servicios Fúnebres
              </p>
            </div>
          </div>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted-strong)]">
            <li>Incluye doulas, hospicios y servicios fúnebres.</li>
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
            </div>
          </div>
        </aside>
      </section>

      <IntakeForm />
    </main>
  );
}
