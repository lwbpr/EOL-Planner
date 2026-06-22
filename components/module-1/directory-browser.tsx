"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY_LABELS } from "@/lib/module-1/resource-directory";
import { TOWNS, type ResourceCategory, type ResourceItem } from "@/lib/module-1/types";

const CATEGORY_ORDER: ResourceCategory[] = [
  "doula",
  "apoyo_complementario",
  "hospicio",
  "servicio_funebre",
];

type DirectoryCounts = {
  total: number;
  byCategory: Record<ResourceCategory, number>;
};

type DirectoryFilter = "none" | "all" | ResourceCategory;
type HospiceScoreItem = {
  label: string;
  value: string;
};

const HOSPICE_QUALITY_INFO_HREF = "/directorio/metodologia-puntuacion-hospicios";

function normalizeUrl(url?: string) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function normalizePhone(phone?: string) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits || null;
}

function getWhatsAppUrl(phone?: string) {
  const normalized = normalizePhone(phone);
  return normalized ? `https://wa.me/${normalized}` : null;
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

function splitDetailText(value: unknown) {
  if (Array.isArray(value)) {
    return toList(value);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/[,;]|\sy\s/gi)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
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

function getSocialLabel(url: string) {
  const normalized = url.toLowerCase();

  if (normalized.includes("instagram.com")) return "Instagram";
  if (normalized.includes("facebook.com")) return "Facebook";
  if (normalized.includes("linkedin.com")) return "LinkedIn";
  if (normalized.includes("youtube.com")) return "YouTube";

  return "Red social";
}

function SectionIcon({
  path,
  className = "h-4 w-4",
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

function SectionHeading({
  title,
  iconPath,
}: {
  title: string;
  iconPath: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[var(--muted)]">
      <SectionIcon path={iconPath} />
      <p className="text-sm font-semibold">{title}</p>
    </div>
  );
}

const HOSPICE_SCORE_LABELS: Record<string, string> = {
  "Hospice Visits in the Last Days of Life": "Visitas en los últimos días de vida",
  "Staffing Ratios": "Proporción de personal",
  "Levels of Care": "Niveles de cuidado",
  "CAHPS Definitely Recommend This Hospice": "Recomendación de familias usuarias",
  "Stability": "Estabilidad",
  "Accreditation": "Acreditación",
  "Health Equity": "Equidad en salud",
  "a fraud penalty": "Penalidad por fraude",
  "fraud penalty": "Penalidad por fraude",
};

function formatScoreNumber(value: string) {
  return value.replace(/\.00$/, "");
}

function parseHospiceTotalScore(resource: ResourceItem) {
  if (resource.category !== "hospicio") return null;

  const rawScore = getDetailValue(resource, "qualityScore");
  const scoreText =
    typeof rawScore === "number"
      ? String(rawScore)
      : typeof rawScore === "string"
        ? rawScore.trim()
        : "";

  if (!scoreText) return null;

  const match = scoreText.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function sortResourcesForDisplay(resources: ResourceItem[]) {
  return resources
    .map((resource, index) => ({ resource, index }))
    .sort((left, right) => {
      if (left.resource.category === "hospicio" && right.resource.category === "hospicio") {
        const leftScore = parseHospiceTotalScore(left.resource);
        const rightScore = parseHospiceTotalScore(right.resource);

        if (leftScore !== null || rightScore !== null) {
          if (leftScore === null) return 1;
          if (rightScore === null) return -1;
          if (rightScore !== leftScore) return rightScore - leftScore;
        }
      }

      return left.index - right.index;
    })
    .map(({ resource }) => resource);
}

function translateBoolean(value: unknown) {
  const text = toText(value)?.toLowerCase();
  if (text === "yes") return "Sí";
  if (text === "no") return "No";
  return toText(value);
}

function translateOwnership(value: unknown) {
  const text = toText(value)?.toLowerCase();
  if (text === "for-profit") return "Con fines de lucro";
  if (text === "non-profit") return "Sin fines de lucro";
  if (text === "government") return "Gubernamental";
  return toText(value);
}

function translateUrbanRural(value: unknown) {
  const text = toText(value)?.toLowerCase();
  if (text === "urban") return "Urbano";
  if (text === "rural") return "Rural";
  return toText(value);
}

function translateFacilityType(value: unknown) {
  const text = toText(value)?.toLowerCase();
  if (text === "freestanding") return "Instalación independiente";
  if (text === "hospital based") return "Basado en hospital";
  if (text === "home health agency based") return "Vinculado a agencia de salud en el hogar";
  return toText(value);
}

function translateDailySize(value: unknown) {
  const text = toText(value);
  if (!text) return null;

  return text
    .replace("Extra Small", "Extra pequeño")
    .replace("Small", "Pequeño")
    .replace("Medium", "Mediano")
    .replace("Large", "Grande")
    .replace("Extra Large", "Extra grande")
    .replace("pts/day", "pacientes por día");
}

function getHospiceCoverageList(resource: ResourceItem) {
  const coverage = resource.coverage;
  if (!coverage) return [];

  const normalized = coverage.replace(/^Puerto Rico:\s*/i, "").trim();
  return normalized
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseHospiceScoreBreakdown(resource: ResourceItem): HospiceScoreItem[] {
  const qualityText = toText(getDetailValue(resource, "qualityScoreCalculation"));
  if (!qualityText) return [];

  const matches = Array.from(
    qualityText.matchAll(
      /(\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)\s*points\s+(?:on|as)\s+(.*?)(?=;|\.|$)/g,
    ),
  );

  return matches.map((match) => {
    const score = formatScoreNumber(match[1]);
    const maxScore = formatScoreNumber(match[2]);
    const rawLabel = match[3].trim();
    const label = HOSPICE_SCORE_LABELS[rawLabel] ?? rawLabel;

    return {
      label,
      value: `${score} / ${maxScore}`,
    };
  });
}

function buildHospiceSummary(resource: ResourceItem) {
  const totalScore = toText(getDetailValue(resource, "qualityScore")) ?? "No disponible";
  const breakdown = parseHospiceScoreBreakdown(resource);

  if (!breakdown.length) {
    return `Puntuación total ${totalScore}.`;
  }

  return `Puntuación total ${totalScore}. Pulsa para ver el desglose completo y la información institucional.`;
}

function HospiceCard({
  resource,
  website,
  sourceUrl,
  isOpen,
  onToggle,
}: {
  resource: ResourceItem;
  website: string | null;
  sourceUrl: string | null;
  isOpen: boolean;
  onToggle: (nextOpen: boolean) => void;
}) {
  const totalScore = toText(getDetailValue(resource, "qualityScore")) ?? "No disponible";
  const breakdown = parseHospiceScoreBreakdown(resource);
  const servedTowns = getHospiceCoverageList(resource);
  const ceoAdministrator = toText(getDetailValue(resource, "ceoAdministrator"));
  const numberServedDaily = translateDailySize(getDetailValue(resource, "numberServedDaily"));
  const ownership = translateOwnership(getDetailValue(resource, "ownership"));
  const medicareCertified = translateBoolean(getDetailValue(resource, "medicareCertified"));
  const yearCertification = toText(getDetailValue(resource, "yearMedicareCertification"));
  const inpatientFacility = translateBoolean(getDetailValue(resource, "hospiceInpatientFacility"));
  const urbanOrRural = translateUrbanRural(getDetailValue(resource, "urbanOrRural"));
  const facilityType = translateFacilityType(getDetailValue(resource, "facilityType"));

  return (
    <details
      open={isOpen}
      onToggle={(event) => onToggle(event.currentTarget.open)}
      className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] p-5 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-4">
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
            <div className="flex items-center gap-3">
              {resource.verification ? (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                  {resource.verification}
                </span>
              ) : null}
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--accent-strong)] transition group-open:rotate-180">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
              <p className="font-semibold text-[var(--ink)]">Puntuación total</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--accent-strong)]">
                {totalScore}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
              <p className="font-semibold text-[var(--ink)]">Información de contacto</p>
              <div className="mt-2 space-y-1 leading-6">
                {resource.phone ? <p>{resource.phone}</p> : null}
                {resource.email ? <p className="break-all">{resource.email}</p> : null}
                {website ? (
                  <p className="break-all">{website.replace(/^https?:\/\//, "")}</p>
                ) : null}
                {!resource.phone && !resource.email && !website ? (
                  <p>No disponible</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
              <p className="font-semibold text-[var(--ink)]">Cobertura</p>
              <p className="mt-2 leading-6">
                {resource.coverage || "Cobertura no especificada"}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 text-sm text-[var(--muted-strong)]">
              <p className="font-semibold text-[var(--ink)]">Resumen</p>
              <p className="mt-2 leading-6">{buildHospiceSummary(resource)}</p>
              <Link
                href={HOSPICE_QUALITY_INFO_HREF}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)] underline decoration-[rgba(201,120,66,0.35)] underline-offset-4"
              >
                ¿Cómo se interpreta esta puntuación?
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </summary>

      <div className="mt-5 grid gap-4">
        <div className="rounded-[1.5rem] border border-[rgba(201,120,66,0.12)] bg-[var(--accent-soft)]/55 p-5">
          <SectionHeading
            title="Desglose de puntuación"
            iconPath="M4 19h16M7 16V8M12 16V5M17 16v-3"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Puntuación total
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--accent-strong)]">
                {totalScore}
              </p>
            </div>
            {breakdown.map((item) => (
              <div key={`${resource.id}-${item.label}`} className="rounded-2xl bg-white/90 p-4">
                <p className="text-sm font-semibold leading-6 text-[var(--ink)]">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--accent-strong)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-5">
            <SectionHeading
              title="Información institucional"
              iconPath="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Administrador / Director / CEO</p>
                <p className="mt-2">{ceoAdministrator || "No disponible"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Tamaño</p>
                <p className="mt-2">{numberServedDaily || "No disponible"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Tipo de propiedad</p>
                <p className="mt-2">{ownership || "No disponible"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Certificado por Medicare</p>
                <p className="mt-2">{medicareCertified || "No disponible"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Año de certificación Medicare</p>
                <p className="mt-2">{yearCertification || "No disponible"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Facilidad de internado de hospicio</p>
                <p className="mt-2">{inpatientFacility || "No disponible"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Ubicación</p>
                <p className="mt-2">{urbanOrRural || "No disponible"}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted-strong)]">
                <p className="font-semibold text-[var(--ink)]">Tipo de facilidad</p>
                <p className="mt-2">{facilityType || "No disponible"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-5">
              <SectionHeading
                title="Municipios a los que sirve"
                iconPath="M12 21s-6-5.33-6-11a6 6 0 1 1 12 0c0 5.67-6 11-6 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {(servedTowns.length ? servedTowns : ["No especificados"]).map((town) => (
                  <span
                    key={`${resource.id}-${town}`}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
                  >
                    {town}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/90 p-5">
              <SectionHeading
                title="Enlaces y contacto"
                iconPath="M21 8.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5M21 8.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1.5M21 8.5l-9 6-9-6"
              />
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <Link
                  href={HOSPICE_QUALITY_INFO_HREF}
                  className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-2 font-semibold text-[var(--accent-strong)]"
                >
                  Ver metodología de calidad
                </Link>
                {resource.phone ? (
                  <a
                    href={`tel:${resource.phone}`}
                    className="rounded-full border border-[var(--line)] bg-white px-3 py-2 font-semibold text-[var(--ink)]"
                  >
                    {resource.phone}
                  </a>
                ) : null}
                {resource.email ? (
                  <a
                    href={`mailto:${resource.email}`}
                    className="rounded-full border border-[var(--line)] bg-white px-3 py-2 font-semibold text-[var(--ink)]"
                  >
                    Correo
                  </a>
                ) : null}
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--line)] bg-white px-3 py-2 font-semibold text-[var(--ink)]"
                  >
                    Sitio web
                  </a>
                ) : null}
                {!website && sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--line)] bg-white px-3 py-2 font-semibold text-[var(--ink)]"
                  >
                    Fuente
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          Fuente: {resource.sourceLabel}
        </p>
      </div>
    </details>
  );
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
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [openHospiceId, setOpenHospiceId] = useState<string | null>(null);

  const doulaRegionOptions = useMemo(() => {
    const slugs = Array.from(
      new Set(
        resourceDirectory
          .filter((resource) => resource.category === "doula")
          .flatMap((resource) => {
            const regions = resource.regions.length ? resource.regions : [];
            return resource.region && !regions.includes(resource.region)
              ? [resource.region, ...regions]
              : regions;
          })
          .filter(Boolean),
      ),
    ).sort((left, right) =>
      (REGION_LABELS[left] ?? left).localeCompare(REGION_LABELS[right] ?? right, "es"),
    );

    return slugs.map((slug) => ({
      slug,
      label: REGION_LABELS[slug] ?? slug,
    }));
  }, [resourceDirectory]);

  const filteredResources = useMemo(() => {
    if (activeFilter === "none") return [];

    return sortResourcesForDisplay(
      resourceDirectory.filter((resource) => {
        const matchesCategory =
          activeFilter === "all" ? true : resource.category === activeFilter;
        const matchesTown =
          selectedTown === "all"
            ? true
            : !resource.townSlug || resource.townSlug === selectedTown;
        const matchesRegion =
          activeFilter === "doula" && selectedRegion !== "all"
            ? resource.category === "doula" &&
              (resource.region === selectedRegion || resource.regions.includes(selectedRegion))
            : true;

        return matchesCategory && matchesTown && matchesRegion;
      }),
    );
  }, [activeFilter, resourceDirectory, selectedRegion, selectedTown]);

  const activeLabel =
    activeFilter === "all"
      ? "Todos los recursos"
      : activeFilter === "none"
        ? null
        : CATEGORY_LABELS[activeFilter];
  const showHospiceQualityIntro = activeFilter === "hospicio";

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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
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

            {activeFilter === "doula" ? (
              <label className="space-y-2">
                <span className="text-sm font-semibold text-[var(--ink)]">
                  Filtrar doulas por región de servicio
                </span>
                <select
                  value={selectedRegion}
                  onChange={(event) => setSelectedRegion(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent-strong)]"
                >
                  <option value="all">Todas las regiones</option>
                  {doulaRegionOptions.map((region) => (
                    <option key={region.slug} value={region.slug}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("none");
                  setSelectedTown("all");
                  setSelectedRegion("all");
                }}
                className="inline-flex w-full items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-soft)]"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <button
            type="button"
            onClick={() => {
              setActiveFilter("all");
              setSelectedRegion("all");
            }}
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
              onClick={() => {
                setActiveFilter(category);
                if (category !== "doula") {
                  setSelectedRegion("all");
                }
              }}
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
                ? activeFilter === "doula" && selectedRegion !== "all"
                  ? selectedTown === "all"
                    ? "Mostrando doulas de la región de servicio seleccionada."
                    : "Mostrando doulas para el pueblo y la región de servicio seleccionados."
                  : selectedTown === "all"
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

        {activeLabel && showHospiceQualityIntro ? (
          <div className="mt-6 rounded-[1.75rem] border border-[rgba(201,120,66,0.18)] bg-[var(--accent-soft)]/55 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  Cómo leer esta puntuación
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-strong)]">
                  La puntuación total resume ocho métricas de calidad publicadas por
                  National Hospice Analytics con datos de Medicare/CMS. Sirve como
                  orientación inicial para comparar hospicios, pero no sustituye una
                  conversación directa sobre servicios, cobertura, disponibilidad y
                  necesidades de la persona y su familia.
                </p>
              </div>
              <Link
                href={HOSPICE_QUALITY_INFO_HREF}
                className="inline-flex items-center justify-center rounded-full border border-[rgba(201,120,66,0.28)] bg-white px-5 py-3 text-sm font-semibold text-[var(--accent-strong)] transition hover:bg-[var(--surface-soft)]"
              >
                ¿Cómo se calcula esta puntuación?
              </Link>
            </div>
          </div>
        ) : null}

        {!activeLabel ? (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-[var(--line-strong)] bg-[var(--surface-soft)] p-6">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Todavía no hay recursos desplegados.
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-strong)]">
              Pulsa Doulas de Final de Vida, Hospicios y Cuidados Paliativos,
              Otros apoyos complementarios, Servicios Fúnebres o Todos los
              recursos para abrir el listado.
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
              const whatsappUrl = getWhatsAppUrl(resource.phone);
              const roleItems = splitDetailText(getDetailValue(resource, "role"));
              const trainingItems = splitDetailText(getDetailValue(resource, "training"));
              const topicItems = toList(getDetailValue(resource, "topics"));
              const aboutText =
                toText(getDetailValue(resource, "about")) ||
                resource.description ||
                "No se añadió una descripción personal todavía.";
              const regionItems = formatRegionList(resource);

              return (
                resource.category === "hospicio" ? (
                  <HospiceCard
                    key={resource.id}
                    resource={resource}
                    website={website}
                    sourceUrl={sourceUrl}
                    isOpen={openHospiceId === resource.id}
                    onToggle={(nextOpen) =>
                      setOpenHospiceId(nextOpen ? resource.id : null)
                    }
                  />
                ) : (
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
                    <div className="mt-5 grid gap-4">
                      <div className="rounded-[1.6rem] border border-[rgba(64,99,74,0.14)] bg-[var(--success-soft)]/80 p-5">
                        <SectionHeading
                          title="Sobre mí"
                          iconPath="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
                        />
                        <p className="mt-3 text-base leading-8 text-[var(--ink)]">
                          {aboutText}
                        </p>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                        <div className="grid gap-4">
                          <div className="rounded-[1.5rem] border border-[rgba(64,99,74,0.14)] bg-[var(--success-soft)]/80 p-4 text-sm text-[var(--muted-strong)]">
                            <SectionHeading
                              title="Roles"
                              iconPath="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                            />
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(roleItems.length ? roleItems : [resource.summary]).map((role) => (
                                <span
                                  key={`${resource.id}-role-${role}`}
                                  className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-strong)]"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-[rgba(64,99,74,0.14)] bg-[var(--success-soft)]/80 p-4 text-sm text-[var(--muted-strong)]">
                            <SectionHeading
                              title="Contacto"
                              iconPath="M21 8.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5M21 8.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1.5M21 8.5l-9 6-9-6"
                            />
                            <div className="mt-3 space-y-2 text-sm text-[var(--ink)]">
                              {resource.phone ? (
                                <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2">
                                  <SectionIcon
                                    path="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.24a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z"
                                    className="h-4 w-4 text-[var(--accent)]"
                                  />
                                  <a href={`tel:${resource.phone}`} className="break-all leading-6">
                                    {resource.phone}
                                  </a>
                                </div>
                              ) : null}
                              {resource.email ? (
                                <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2">
                                  <SectionIcon
                                    path="M4 4h16v16H4zM4 7l8 6 8-6"
                                    className="h-4 w-4 text-[var(--accent)]"
                                  />
                                  <a href={`mailto:${resource.email}`} className="break-all leading-6">
                                    {resource.email}
                                  </a>
                                </div>
                              ) : null}
                              {website ? (
                                <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2">
                                  <SectionIcon
                                    path="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 0c2.5 2.7 4 6.2 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.2-4-10s1.5-7.3 4-10Zm-9.5 10h19"
                                    className="h-4 w-4 text-[var(--accent)]"
                                  />
                                  <a href={website} target="_blank" rel="noreferrer" className="break-all leading-6">
                                    {website.replace(/^https?:\/\//, "")}
                                  </a>
                                </div>
                              ) : null}
                              {resource.socials?.map((social) => (
                                <div
                                  key={social}
                                  className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2"
                                >
                                  <SectionIcon
                                    path="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10.5 9.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0ZM18 6.5h.01"
                                    className="h-4 w-4 text-[var(--accent)]"
                                  />
                                  <a
                                    href={normalizeUrl(social) ?? social}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="break-all leading-6"
                                  >
                                    {getSocialLabel(social)}
                                  </a>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                              {resource.email ? (
                                <a
                                  href={`mailto:${resource.email}`}
                                  className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                                >
                                  Enviar correo
                                </a>
                              ) : null}
                              {whatsappUrl ? (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center rounded-full bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                                >
                                  WhatsApp
                                </a>
                              ) : null}
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-[rgba(64,99,74,0.14)] bg-[var(--success-soft)]/80 p-4 text-sm text-[var(--muted-strong)]">
                            <SectionHeading
                              title="Regiones de Servicio"
                              iconPath="M12 21s-6-5.33-6-11a6 6 0 1 1 12 0c0 5.67-6 11-6 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            />
                            <div className="mt-3 flex flex-wrap gap-2">
                              {regionItems.map((region) => (
                                <span
                                  key={`${resource.id}-${region}`}
                                  className="rounded-full border border-[rgba(64,99,74,0.12)] bg-white/85 px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
                                >
                                  {region}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="rounded-[1.5rem] border border-[rgba(64,99,74,0.14)] bg-[var(--success-soft)]/80 p-4 text-sm text-[var(--muted-strong)]">
                            <SectionHeading
                              title="Formación"
                              iconPath="M3 7l9-4 9 4-9 4-9-4Zm0 0v6l9 4 9-4V7M7 9.5v4.2"
                            />
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(trainingItems.length
                                ? trainingItems
                                : ["No especificada"]).map((training) => (
                                <span
                                  key={`${resource.id}-training-${training}`}
                                  className="rounded-full border border-[rgba(201,120,66,0.12)] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--accent-strong)]"
                                >
                                  {training}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-[rgba(64,99,74,0.14)] bg-[var(--success-soft)]/80 p-4 text-sm text-[var(--muted-strong)]">
                            <SectionHeading
                              title="Áreas de Enfoque/Especialidad"
                              iconPath="M4 6h16M4 12h16M4 18h10"
                            />
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(topicItems.length ? topicItems : resource.services.slice(0, 8)).map(
                                (topic) => (
                                  <span
                                    key={`${resource.id}-${topic}`}
                                    className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-strong)]"
                                  >
                                    {topic}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
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
                )
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
