import Link from "next/link";
import { AmorirSupportCard } from "@/components/module-1/amorir-support-card";
import { normalizeIntakePayload } from "@/lib/module-1/intake";
import { buildIntro, buildNextSteps, getTownName, recommendResources } from "@/lib/module-1/recommend";
import { getCategoryLabel, getResourceDirectory } from "@/lib/module-1/resource-directory";

export const revalidate = 86400;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function normalizeUrl(url?: string) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const payload = normalizeIntakePayload(await searchParams);
  const resourceDirectory = await getResourceDirectory();
  const recommendations = recommendResources(resourceDirectory, payload);
  const nextSteps = buildNextSteps(payload);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(71,60,53,0.1)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Orientación inicial
            </p>
            <h1 className="mt-3 font-display text-4xl text-[var(--ink)]">
              Coordinador de Final de Vida
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-strong)]">
              {buildIntro(payload)}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/orientador"
              className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
            >
              Ajustar respuestas
            </Link>
            <Link
              href="/directorio"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Ver directorio completo
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Pueblo
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--ink)]">
              {getTownName(payload.town)}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Escenario
            </p>
            <p className="mt-2 text-lg font-semibold capitalize text-[var(--ink)]">
              {payload.care_setting.replaceAll("_", " ")}
            </p>
          </div>
          <div className="rounded-3xl bg-[var(--success-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--success-strong)]">
              Necesidades seleccionadas
            </p>
            <p className="mt-2 text-lg font-semibold capitalize text-[var(--success-strong)]">
              {payload.needs.map((need) => need.replaceAll("_", " ")).join(", ")}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Próximos pasos sugeridos
          </p>
          <ol className="mt-5 space-y-4">
            {nextSteps.map((step, index) => (
              <li
                key={step}
                className="rounded-3xl border border-[var(--line)] bg-white p-4 text-sm leading-7 text-[var(--muted-strong)]"
              >
                <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          {payload.notes ? (
            <div className="mt-6 rounded-3xl border border-dashed border-[var(--line-strong)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">
                Contexto que compartiste
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {payload.notes}
              </p>
            </div>
          ) : null}

          <div className="mt-6">
            <AmorirSupportCard payload={payload} compact />
          </div>
        </aside>

        <section className="rounded-[2rem] border border-[var(--line)] bg-white/80 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Recursos priorizados
              </p>
              <h2 className="mt-3 font-display text-3xl text-[var(--ink)]">
                Resultado inicial para {getTownName(payload.town)}
              </h2>
            </div>
            <span className="rounded-full bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
              {recommendations.length} resultados sugeridos
            </span>
          </div>

          {recommendations.length ? (
            <div className="mt-6 grid gap-4">
              {recommendations.map(({ resource, score }) => {
                const website = normalizeUrl(resource.website);
                const sourceUrl = normalizeUrl(resource.sourceUrls?.[0]);

                return (
                  <article
                    key={resource.id}
                    className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                          {getCategoryLabel(resource.category)}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">
                          {resource.name}
                        </h3>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                        prioridad {score}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-[var(--muted-strong)]">
                      {resource.description || resource.summary}
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl bg-white p-3 text-sm text-[var(--muted-strong)]">
                        <p className="font-semibold text-[var(--ink)]">Ubicación</p>
                        <p className="mt-1">
                          {resource.town || "Municipio no especificado"}
                          {resource.address ? ` · ${resource.address}` : ""}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-3 text-sm text-[var(--muted-strong)]">
                        <p className="font-semibold text-[var(--ink)]">Cobertura y verificación</p>
                        <p className="mt-1">
                          {resource.coverage || "Cobertura no especificada"}
                          {resource.verification ? ` · ${resource.verification}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {resource.phone ? (
                        <a
                          href={`tel:${resource.phone}`}
                          className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                        >
                          {resource.phone}
                        </a>
                      ) : null}
                      {resource.email ? (
                        <a
                          href={`mailto:${resource.email}`}
                          className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                        >
                          {resource.email}
                        </a>
                      ) : null}
                      {website ? (
                        <a
                          href={website}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                        >
                          Sitio web
                        </a>
                      ) : null}
                      {!website && sourceUrl ? (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                        >
                          Fuente
                        </a>
                      ) : null}
                    </div>

                    {resource.services.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {resource.services.slice(0, 5).map((service) => (
                          <span
                            key={`${resource.id}-${service}`}
                            className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent-strong)]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Fuente: {resource.sourceLabel}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">
                No aparecieron coincidencias claras con este filtro.
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
                Intenta cambiar el pueblo, abrir el directorio completo o
                ajustar las necesidades seleccionadas para explorar más recursos.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
