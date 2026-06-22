import Link from "next/link";

export const revalidate = 86400;

const QUESTIONS = [
  "¿Qué servicios proporcionan además de los servicios básicos de hospicio?",
  "¿Este hospicio trabaja con Medicare?",
  "¿Qué apoyo ofrece a la familia, al círculo cercano o a las personas cuidadoras?",
  "¿Cómo se ofrecen los servicios fuera del horario regular?",
  "¿Cuánto tarda normalmente el proceso de admisión una vez se solicita el servicio?",
  "¿Está acreditado por una organización nacional y puede mostrar documentación?",
];

const DIFFERENCES = [
  "Disponibilidad de servicios fuera del horario regular.",
  "Capacidad de ofrecer cuidados continuos para ciertas afecciones.",
  "Servicios basados en la fe o sensibles a convicciones espirituales.",
  "Fuerza del programa de voluntariado.",
  "Acreditación por organizaciones nacionales.",
];

export default function ChoosingHospicePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10 md:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(71,60,53,0.1)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Directorio de hospicios
            </p>
            <h1 className="mt-3 font-display text-4xl text-[var(--ink)]">
              Cómo elegir cuidados de hospicio adecuados para usted
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--muted-strong)]">
              Esta guía resume preguntas y criterios prácticos para comparar opciones
              de hospicio con más claridad. La meta no es escoger solo por reputación
              o cercanía, sino entender cuál proveedor responde mejor a la situación
              concreta de la persona y su familia.
            </p>
          </div>

          <Link
            href="/directorio"
            className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
          >
            Volver al directorio
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Pistas rápidas
          </p>

          <div className="mt-5 grid gap-4">
            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Empiece con una lista corta
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
                Si el tiempo y la situación lo permiten, compare varias opciones de su
                zona antes de decidir. Las referencias médicas ayudan, pero igual vale
                la pena hacer preguntas.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                No todos los hospicios se sienten igual
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
                Aunque los hospicios certificados por Medicare ofrecen los mismos
                servicios básicos, hay diferencias importantes en apoyos adicionales,
                tiempos de respuesta y forma de acompañar.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Confíe también en su percepción
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
                La claridad con que contestan, la forma de escuchar y la transparencia
                al explicar límites del servicio también importan mucho.
              </p>
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Qué comparar entre hospicios
          </p>

          <div className="mt-5 grid gap-4">
            {DIFFERENCES.map((item) => (
              <article
                key={item}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5 text-sm leading-7 text-[var(--muted-strong)]"
              >
                {item}
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Preguntas para hacer antes de elegir
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {QUESTIONS.map((question) => (
            <div
              key={question}
              className="rounded-3xl bg-white p-5 text-sm leading-7 text-[var(--muted-strong)]"
            >
              {question}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Próximos pasos sugeridos
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-[var(--surface)] p-5 text-sm leading-7 text-[var(--muted-strong)]">
            Identifique dos o tres hospicios que cubran su pueblo o área inmediata.
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-5 text-sm leading-7 text-[var(--muted-strong)]">
            Compare puntuación, certificación, internado y tiempos de respuesta, pero
            compleméntelo con llamadas directas.
          </div>
          <div className="rounded-3xl bg-[var(--surface)] p-5 text-sm leading-7 text-[var(--muted-strong)]">
            Tome nota de cómo explican los servicios, qué apoyo ofrecen a la familia y
            si contestan con claridad las preguntas difíciles.
          </div>
        </div>
      </section>
    </main>
  );
}
