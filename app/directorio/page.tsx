import Link from "next/link";
import { CATEGORY_LABELS, getDirectoryCounts, getResourceDirectory } from "@/lib/module-1/resource-directory";
import type { ResourceCategory } from "@/lib/module-1/types";

const CATEGORY_ORDER: ResourceCategory[] = [
  "doula",
  "hospicio",
  "servicio_funebre",
];

function normalizeUrl(url?: string) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export default async function DirectoryPage() {
  const directoryCounts = await getDirectoryCounts();
  const resourceDirectory = await getResourceDirectory();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 md:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(71,60,53,0.1)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Directorio de recursos
            </p>
            <h1 className="mt-3 font-display text-4xl text-[var(--ink)]">
              Recursos de final de vida en Puerto Rico
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-strong)]">
              Este directorio reúne las tres bases compartidas para crear una
              primera vista unificada de doulas, hospicios y servicios fúnebres
              en Puerto Rico.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
          >
            Volver al orientador
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-3xl bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Total
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
              {directoryCounts.total}
            </p>
          </div>
          {CATEGORY_ORDER.map((category) => (
            <div key={category} className="rounded-3xl bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {CATEGORY_LABELS[category]}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--ink)]">
                {directoryCounts.byCategory[category]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {CATEGORY_ORDER.map((category) => {
        const items = resourceDirectory.filter((resource) => resource.category === category);

        return (
          <section
            key={category}
            className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                  Categoría
                </p>
                <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
                  {CATEGORY_LABELS[category]}
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{items.length} recursos</p>
            </div>

            <div className="mt-6 grid gap-4">
              {items.map((resource) => {
                const website = normalizeUrl(resource.website);
                const sourceUrl = normalizeUrl(resource.sourceUrls?.[0]);

                return (
                  <article
                    key={resource.id}
                    className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--ink)]">{resource.name}</h3>
                        <p className="mt-2 text-sm text-[var(--muted-strong)]">
                          {resource.town || "Municipio no especificado"}
                          {resource.address ? ` · ${resource.address}` : ""}
                        </p>
                      </div>
                      {resource.verification ? (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                          {resource.verification}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-sm leading-7 text-[var(--muted-strong)]">
                      {resource.description || resource.summary}
                    </p>

                    {resource.services.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {resource.services.slice(0, 6).map((service) => (
                          <span
                            key={`${resource.id}-${service}`}
                            className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent-strong)]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    ) : null}

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

                    {(resource.coverage || resource.organization) ? (
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {resource.coverage ? (
                          <div className="rounded-2xl bg-white p-3 text-sm text-[var(--muted-strong)]">
                            <p className="font-semibold text-[var(--ink)]">Cobertura</p>
                            <p className="mt-1">{resource.coverage}</p>
                          </div>
                        ) : null}
                        {resource.organization ? (
                          <div className="rounded-2xl bg-white p-3 text-sm text-[var(--muted-strong)]">
                            <p className="font-semibold text-[var(--ink)]">Organización</p>
                            <p className="mt-1">{resource.organization}</p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Fuente: {resource.sourceLabel}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
