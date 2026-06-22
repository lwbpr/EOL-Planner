import Link from "next/link";

export const revalidate = 86400;

const METRICS = [
  {
    title: "Visitas en los últimos días de vida",
    points: "20 puntos",
    body:
      "Mide con qué frecuencia el personal de hospicio acompaña a la persona en los días finales de vida. Más visitas suele indicar mayor presencia clínica y mejor apoyo a la familia.",
  },
  {
    title: "Proporción de personal",
    points: "20 puntos",
    body:
      "Evalúa el tiempo promedio de atención directa por paciente y por día. Ayuda a estimar cuánta capacidad real tiene el hospicio para acompañar de cerca.",
  },
  {
    title: "Niveles de cuidado",
    points: "20 puntos",
    body:
      "Reconoce si el hospicio ofrece los cuatro niveles de cuidado reconocidos por Medicare. Mientras más niveles ofrece, más preparado está para responder a necesidades cambiantes.",
  },
  {
    title: "Recomendación de familias usuarias",
    points: "20 puntos",
    body:
      "Se basa en la pregunta de la encuesta CAHPS sobre si la familia recomendaría ese hospicio. Resume la experiencia general de cuidado y trato recibido.",
  },
  {
    title: "Estabilidad institucional",
    points: "10 puntos",
    body:
      "Favorece hospicios con varios años de certificación y sin cambios recientes de dueño. La idea es que la continuidad organizacional puede sostener procesos más consistentes.",
  },
  {
    title: "Acreditación",
    points: "5 puntos",
    body:
      "Otorga más puntos a hospicios acreditados por organizaciones externas. Eso sugiere revisión adicional más allá de los requisitos mínimos de Medicare.",
  },
  {
    title: "Equidad en salud",
    points: "5 puntos",
    body:
      "Reconoce a hospicios que también atienden personas con Medicaid. Se usa como una señal de acceso más amplio a comunidades con menos recursos.",
  },
  {
    title: "Penalidad por fraude",
    points: "-15 puntos",
    body:
      "Si existe una acusación o condena vinculada a fraude, desperdicio o abuso según OIG/CMS, se descuentan puntos. Es una penalidad, no una categoría positiva.",
  },
];

export default function HospiceQualityMethodologyPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10 md:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(71,60,53,0.1)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Directorio de hospicios
            </p>
            <h1 className="mt-3 font-display text-4xl text-[var(--ink)]">
              Cómo se calcula la puntuación de calidad
            </h1>
            <p className="mt-4 text-base leading-8 text-[var(--muted-strong)]">
              Esta guía resume la metodología publicada por National Hospice Analytics
              para ayudar a interpretar la puntuación total que aparece en el directorio.
              La puntuación sirve como referencia inicial para comparar opciones, no como
              sustituto de una conversación directa sobre necesidades clínicas, cobertura,
              disponibilidad y trato humano.
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
                Qué mide esta puntuación
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
                Resume ocho métricas ponderadas construidas con datos de Medicare/CMS y
                otras fuentes federales usadas por National Hospice Analytics.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Qué significa un puntaje bajo
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
                Un puntaje por debajo de 50 no siempre significa peor cuidado. Según la
                metodología, con frecuencia refleja datos insuficientes para calcular la
                puntuación completa.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Qué significa 84 o más
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
                Ese nivel ubica al hospicio dentro del 20% superior a nivel nacional en
                esta metodología.
              </p>
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Las 8 métricas actuales
          </p>

          <div className="mt-5 grid gap-4">
            {METRICS.map((metric) => (
              <article
                key={metric.title}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <h2 className="text-lg font-semibold text-[var(--ink)]">{metric.title}</h2>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
                    {metric.points}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-strong)]">
                  {metric.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Cómo usar esta información
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 text-sm leading-7 text-[var(--muted-strong)]">
            Usa la puntuación como punto de partida para comparar hospicios, no como la
            única señal de decisión.
          </div>
          <div className="rounded-3xl bg-white p-5 text-sm leading-7 text-[var(--muted-strong)]">
            Confirma cobertura por pueblo, disponibilidad actual, tipo de apoyo clínico y
            capacidad de respuesta para la situación concreta.
          </div>
          <div className="rounded-3xl bg-white p-5 text-sm leading-7 text-[var(--muted-strong)]">
            Si dos opciones parecen parecidas, vale la pena preguntar por visitas,
            comunicación con la familia, manejo de crisis y niveles de cuidado ofrecidos.
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-[var(--muted-strong)]">
          Fuente metodológica original:{" "}
          <a
            href="https://www.hospiceanalytics.com/blogs/healthcare-policy/2025/10/14/hospice-quality"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[var(--accent-strong)] underline decoration-[rgba(201,120,66,0.35)] underline-offset-4"
          >
            National Hospice Analytics, “Hospice Quality”
          </a>
          .
        </p>
      </section>
    </main>
  );
}
