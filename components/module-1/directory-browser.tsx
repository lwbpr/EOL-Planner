"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABELS } from "@/lib/module-1/resource-directory";
import { TOWNS, type ResourceCategory, type ResourceItem } from "@/lib/module-1/types";

const CATEGORY_ORDER: ResourceCategory[] = [
  "doula",
  "hospicio",
  "servicio_funebre",
];

type DirectoryCounts = {
  total: number;
  byCategory: Record<ResourceCategory, number>;
};

type DirectoryFilter = "none" | "all" | ResourceCategory;

function normalizeUrl(url?: string) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

const REGION_LABELS: Record<string, string> = {
  central: "Central",
  este: "Este",
  "este-central": "Este central",
  metro: "Metro",
  norte: "Norte",
  oeste: "Oeste",
  online: "En línea",
  sur: "Sur",
};

function getDetailValue(resource: ResourceItem, key: string) {
  return resource.details?.[key];
}

function toList(value: unknown) {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((item) => String(item).trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function toText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formatRegionList(resource: ResourceItem) {
  const labels = Array.from(
    new Set(
      resource.regions
        .map((region) => REGION_LABELS[region] ?? region)
        .filter(Boolean),
    ),
  );

  if (resource.town && !labels.includes(resource.town)) {
    labels.unshift(resource.town);
  }

  return labels;
}

type DirectoryBrowserProps = {
  directoryCounts: DirectoryCounts;
  resourceDirectory: ResourceItem[];
};

export function DirectoryBrowser({
  directoryCounts,
  resourceDirectory,
}: DirectoryBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<DirectoryFilter>("none");
  const [selectedTown, setSelectedTown] = useState("all");

  const filteredResources = useMemo(() => {
    if (activeFilter === "none") return [];

    return resourceDirectory.filter((resource) => {
      const matchesCategory =
        activeFilter === "all" ? true : resource.category === activeFilter;
      const matchesTown =
        selectedTown === "all" ? true : resource.townSlug === selectedTown;

      return matchesCategory && matchesTown;
    });
  }, [activeFilter, resourceDirectory, selectedTown]);

  const activeLabel =
    activeFilter === "all"
      ? "Todos los recursos"
      : activeFilter === "none"
        ? null
        : CATEGORY_LABELS[activeFilter];

  return (
    <>
      <section className="rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_24px_80px_rgba(71,60,53,0.1)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="max-w-3xl text-base leading-8 text-[var(--muted-strong)]">
              Escoge una categoría general o abre todos los recursos y luego
              filtra por pueblo para ver solo lo que haga sentido para esa
              búsqueda.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--ink)]">
                Filtrar por pueblo
              </span>
              <select
                value={selectedTown}
                onChange={(event) => setSelectedTown(event.target.value)}
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)]"
              >
                <option value="all">Todos los pueblos</option>
                {TOWNS.map((town) => (
                  <option key={town.slug} value={town.slug}>
                    {town.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("none");
                  setSelectedTown("all");
                }}
                className="inline-flex w-full items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`rounded-3xl border p-5 text-left transition ${
              activeFilter === "all"
                ? "border-[var(--accent-strong)] bg-[var(--accent-soft)]"
                : "border-[var(--line)] bg-white hover:border-[var(--line-strong)] hover:bg-[var(--surface-soft)]"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Todos
            </p>
            <p className="mt-2 text-xl font-semibold text-[var(--ink)]">
              Todos los recursos
            </p>
            <p className="mt-2 text-sm text-[var(--muted-strong)]">
              {directoryCounts.total} recursos
            </p>
          </button>

          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveFilter(category)}
              className={`rounded-3xl border p-5 text-left transition ${
                activeFilter === category
                  ? "border-[var(--accent-strong)] bg-[var(--accent-soft)]"
                  : "border-[var(--line)] bg-white hover:border-[var(--line-strong)] hover:bg-[var(--surface-soft)]"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Categoría
              </p>
              <p className="mt-2 text-xl font-semibold text-[var(--ink)]">
                {CATEGORY_LABELS[category]}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-strong)]">
                {directoryCounts.byCategory[category]} recursos
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Resultados del directorio
            </p>
            <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
              {activeLabel
                ? activeLabel
                : "Selecciona una categoría para ver recursos"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
              {activeLabel
                ? selectedTown === "all"
                  ? "Mostrando resultados para todo Puerto Rico."
                  : "Mostrando resultados para el pueblo seleccionado."
                : "De primeras el directorio queda cerrado para que la persona abra solo la categoría que necesita."}
            </p>
          </div>

          {activeLabel ? (
            <span className="rounded-full bg-[var(--surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-strong)]">
              {filteredResources.length} resultados
            </span>
          ) : null}
        </div>

        {!activeLabel ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-6">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Todavía no hay recursos desplegados.
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
              Pulsa Doulas de Final de Vida, Hospicios y Cuidados Paliativos,
              Servicios Fúnebres o Todos los recursos para
              abrir el listado.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-6">
            <p className="text-sm font-semibold text-[var(--ink)]">
              No aparecieron recursos con ese filtro.
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
              Prueba con otro pueblo o cambia la categoría para ampliar la
              búsqueda.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {filteredResources.map((resource) => {
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
                        {CATEGORY_LABELS[resource.category]}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">
                        {resource.name}
                      </h3>
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

                  {resource.category === "doula" ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
                        <p className="font-semibold text-[var(--ink)]">Roles</p>
                        <p className="mt-2 leading-7">
                          {toText(getDetailValue(resource, "role")) || resource.summary}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
                        <p className="font-semibold text-[var(--ink)]">Formación</p>
                        <p className="mt-2 leading-7">
                          {toText(getDetailValue(resource, "training")) || "No especificada"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
                        <p className="font-semibold text-[var(--ink)]">Contacto</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {resource.phone ? (
                            <a
                              href={`tel:${resource.phone}`}
                              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                            >
                              {resource.phone}
                            </a>
                          ) : null}
                          {resource.email ? (
                            <a
                              href={`mailto:${resource.email}`}
                              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                            >
                              {resource.email}
                            </a>
                          ) : null}
                          {website ? (
                            <a
                              href={website}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                            >
                              Sitio web
                            </a>
                          ) : null}
                          {resource.socials?.map((social) => (
                            <a
                              key={social}
                              href={normalizeUrl(social) ?? social}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                            >
                              Redes
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
                        <p className="font-semibold text-[var(--ink)]">
                          Áreas de Enfoque/Especialidad
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {toList(getDetailValue(resource, "topics")).length
                            ? toList(getDetailValue(resource, "topics")).map((topic) => (
                                <span
                                  key={`${resource.id}-${topic}`}
                                  className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent-strong)]"
                                >
                                  {topic}
                                </span>
                              ))
                            : resource.services.slice(0, 8).map((service) => (
                                <span
                                  key={`${resource.id}-${service}`}
                                  className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent-strong)]"
                                >
                                  {service}
                                </span>
                              ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
                        <p className="font-semibold text-[var(--ink)]">Regiones de Servicio</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {formatRegionList(resource).map((region) => (
                            <span
                              key={`${resource.id}-${region}`}
                              className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]"
                            >
                              {region}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)] md:col-span-2">
                        <p className="font-semibold text-[var(--ink)]">Sobre mí</p>
                        <p className="mt-2 leading-7">
                          {toText(getDetailValue(resource, "about")) ||
                            resource.description ||
                            "No se añadió una descripción personal todavía."}
                        </p>
                      </div>
                    </div>
                  ) : resource.services.length ? (
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

                  {resource.category !== "doula" ? (
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
                  ) : null}

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
        )}
      </section>
    </>
  );
}
